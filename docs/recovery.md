# Recovery and feasibility (P0 / P1)
 
Protocol: V3 preflight revision, 26 November 2026. All legacy scoring is quarantined; this branch is not a benchmark release.
 
## Evidence
- Base commit b95940419a4538ce249bcfaa948fce065b477847.
- Historical commit 73e441c1139bca30f50870512e765ad1926b21db is not available via the GitHub commit API (422, no commit found); do not infer that the original local clone was deleted.
- Remote history includes T01 spec/checks/rubric, T0–T3 legacy scorer sources, candidate manifests/equivalence maps and smoke.yml. It lacks the full T02–T12 assets and several package.json script targets. Do not fabricate recovered files.
- The local execution environment has Node 22.16.0, npm 10.9.2, Chromium 144.0.7559.96; Git clone and npm view failed DNS, and Docker is not on PATH. These are environment failures, not design-system failures.
 
## Runbook
1. Recover the historical commit from its original clone if accessible. Inspect and preserve it on a separate recovery branch before any merge. If unavailable, reconstruct only missing files using the normative task contracts and label them new work.
2. In a disposable checkout, run `node scripts/preflight.mjs`. Review tracked files and missing dependencies. Once legacy scripts are reviewed, run `node scripts/preflight.mjs --run-legacy`. Save stdout JSON outside the repo. Nonzero means blocked, not a measured score.
3. Run `node scripts/preflight.mjs --registry` on a network-enabled runner to collect public metadata responses for historical package and peer pins. Review exact versions, integrity, license and compatibility against official artifacts. No automatic upgrades. This is a metadata probe, not an installation or eligibility pass.
4. P0 closes only when recovery disposition is documented, tracked/missing file inventory and actual test exits are available, and legacy fixture data is removed from the project headline. P1 closes only after one verified candidate and raw control build and render in the pinned environment, with metadata, docs and rights evidence. A registry response is not sufficient.
5. P2 measurement proof (T01/T04 and independent reviewer) follows P1. P3 offline slice follows P2. No paid API requests before separately approved P4 budget. No public scores before P7.
 
## Decision log
- Preserve existing commits and legacy scores as explicitly synthetic diagnostics; no destructive reset.
- Use an isolated build branch and draft PR. Keep main unchanged pending review.
- Stop on missing historical files, unresolved registry metadata or missing Docker; do not substitute simulated success.
- No benchmark run or publication authorized by this recovery branch.
