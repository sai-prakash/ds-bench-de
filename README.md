# ds-bench-de

Public, reproducible benchmark of **agent-readiness** for the public design systems of major German companies.

The leaderboard ranks **design systems**, not models.

**Phase: 2 — two-system pipeline proof.** Specs approved. LLM generation / full T0 Vite / full Playwright T3 remain `NOT_MEASURED` without API keys and a complete npm toolchain.

Fixture T1/T2 (+ partial Chrome T3 on raw-html T01): [reports/leaderboard.md](reports/leaderboard.md).

Clone and run:

```bash
npm test
npm run validate-tasks
npm run leakage
npm run score-fixtures
npm run determinism
npm run report
```

See STATUS.md. Local commit: `73e441c`.
