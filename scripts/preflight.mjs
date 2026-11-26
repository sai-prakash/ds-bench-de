// P0 / FR-01 / FR-03: diagnostics only; never runs a model or publishes results.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.argv.find(a => a.startsWith('--root='))?.slice(7) ?? '.');
const registry = process.argv.includes('--registry');
const commands = [];
function run(command, args, timeout = 30000) {
  const p = spawnSync(command, args, { cwd: root, encoding: 'utf8', timeout, maxBuffer: 4 * 1024 * 1024, env: { ...process.env, CI: 'true' } });
  const row = { command: [command, ...args], exit: p.status, error: p.error?.code ?? null, stdout: p.stdout ?? '', stderr: p.stderr ?? '' };
  commands.push(row);
  return row;
}
const tracked = run('git', ['ls-files']).stdout.split('\n').filter(Boolean);
run('git', ['status', '--short']);
run('git', ['log', '-1', '--format=%H']);
const recovery = run('git', ['cat-file', '-t', '73e441c1139bca30f50870512e765ad1926b21db']);
run('node', ['--version']);
run('npm', ['--version']);
run('docker', ['--version']);
const pkg = JSON.parse(readFileSync(resolve(root, 'docs/evidence/legacy-package.json'), 'utf8'));
const required = new Set(['package.json', '.github/workflows/smoke.yml']);
for (const script of Object.values(pkg.scripts ?? {})) {
  for (const path of script.matchAll(/(?:^|\s)((?:eval|scripts|harness)\/[^\s]+\.ts)(?=\s|$)/g)) required.add(path[1]);
}
for (let i = 1; i <= 12; i++) {
  const task = 'T' + String(i).padStart(2, '0');
  for (const name of ['spec.md', 'checks.json', 'rubric.md', 'mock.ts']) required.add('tasks/' + task + '/' + name);
}
const missing = [...required].filter(p => !existsSync(resolve(root, p))).sort();
const checks = [];
// Explicit opt-in: only run reviewed repository scripts in a disposable checkout.
if (process.argv.includes('--run-legacy')) {
  for (const name of ['test', 'validate-tasks', 'leakage', 'score-fixtures', 'determinism', 'report']) {
    const original = pkg.scripts[name];
    const [exe, ...args] = original.split(/\s+/);
    if (exe !== 'node' || args.some(a => !/^[\w./-]+$/.test(a))) throw new Error('Unsupported legacy command: ' + name);
    checks.push(run(exe, args, 120000));
  }
}
const registryChecks = [];
if (registry) {
  const slugs = ['sap-ui5', 'siemens-ix', 'telekom-scale', 'porsche-ds', 'db-ux'];
  for (const slug of slugs) {
    const manifest = JSON.parse(readFileSync(resolve(root, 'systems', slug, 'manifest.json'), 'utf8'));
    for (const [name, version] of [[manifest.package, manifest.version], ...Object.entries(manifest.peers ?? {})]) {
      if (typeof name !== 'string' || typeof version !== 'string' || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version)) {
        registryChecks.push({ slug, name, version, status: 'INVALID_PIN' }); continue;
      }
      const result = run('npm', ['view', name + '@' + version, 'version', 'license', 'dist.integrity', 'peerDependencies', '--json', '--fetch-retries=0', '--fetch-timeout=10000'], 15000);
      registryChecks.push({ slug, name, version, status: result.exit === 0 ? 'REGISTRY_RESPONSE_REVIEW_REQUIRED' : 'NOT_VERIFIED', commandIndex: commands.length - 1 });
    }
  }
}
// P0 is recovery, not full benchmark completion. Old missing tasks/scorers are tracked debt.
const baselineRequired = ['README.md', 'docs/recovery.md', 'docs/evidence/legacy-package.json', 'docs/evidence/p0-run-45773249901.json', 'scripts/preflight.mjs', 'scripts/recovery.test.ts', 'package.json', '.github/workflows/smoke.yml', ...['t0','t1','t2','t3'].map(t => 'eval/tiers/' + t + '/score.ts')];
const baselineMissing = baselineRequired.filter(p => !tracked.includes(p) || !existsSync(resolve(root,p)));
const baseline = run('npm', ['test']);
const p0 = baselineMissing.length === 0 && baseline.exit === 0 ? 'RECOVERY_BASELINE_PASS' : 'BLOCKED';
console.log(JSON.stringify({ kind: 'preflight_diagnostics_not_benchmark', root, tracked, missing, baselineMissing, historicalCommitAvailable: recovery.exit === 0, p0, p1: 'NOT_PASSED', registryChecks, commands }, null, 2));
process.exitCode = p0 === 'BLOCKED' ? 1 : 0;
