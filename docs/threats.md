# Threats to validity

Honest list. Update when a threat is retired with evidence.

## Confirmed now (Phase 1)

- Paper inclusion, not install proof. Packages were verified on the public npm registry and docs URLs on 2026-09-01. The fresh Vite app in under 10 minutes gate is not measured until Phase 2.
- Beta package in the sample. Telekom Scale is pinned at 3.0.0-beta.161.
- Task suite size. Twelve tasks cannot cover every pattern.
- German-company sample is not all German design systems. Internal-only kits are rejected.
- shadcn baseline is a different distribution mechanism.

## Expected in later phases

- Single vendor if no non-Anthropic key is available.
- Temperature 0 variance.
- Retrieval choice (BM25 top-8, 12k cap).
- Judge bias (T4). kappa gate is 0.6.
- Weight choice. Publish equal-weight leaderboard next to default ARS.
- Playwright vs real users.
- Cost and rate limits.

## Out of scope on purpose

- Internal or employer design systems
- Native mobile kits
- Ranking models
