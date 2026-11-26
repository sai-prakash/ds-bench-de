# ds-bench-de

A research benchmark of coding-agent readiness for public German design systems.

**Status: recovery and feasibility only. No measured benchmark leaderboard is available.** Historical synthetic fixture outputs are not comparable research results. The previous partial implementation is preserved for migration.

## Start here

See [recovery plan](docs/recovery.md). In a disposable checkout with Node 22, run:

```sh
node scripts/preflight.mjs > preflight.json
```

A nonzero exit indicates unresolved recovery work. Use `--run-legacy` only after reviewing the legacy scripts; `--registry` adds public npm metadata probes. Neither invokes paid model APIs. Registry responses alone do not establish eligibility.

No production generation, release, or ranking until the required gates pass.
