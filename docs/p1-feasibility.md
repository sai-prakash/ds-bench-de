# P1 — Engineering feasibility, not benchmark results

## Run

`node scripts/p1-feasibility.mjs <evidence-directory>` runs two minimal, human-authored applications (raw HTML control and SAP UI5), with no model API. It verifies candidate pins through npm, generates a candidate lock, installs with npm ci, executes TypeScript and Vite, then drives Chromium by accessible role, pointer and keyboard, scans with axe, records failures, and blocks non-loopback browser requests. The script is a spike, not the production sandbox, inventory extractor or task scorer.

## Exact UI5 setup provenance

- Official release v2.26.0: https://github.com/UI5/webcomponents-react/releases/tag/v2.26.0
- Tagged README: https://github.com/UI5/webcomponents-react/blob/v2.26.0/README.md (git blob 60d90c74afcefe6c7486e11b1d8ad2f33ef2a709). The setup describes ThemeProvider, Button subpath imports and the assets import; the spike follows these.
- Tagged package manifest: https://github.com/UI5/webcomponents-react/blob/v2.26.0/packages/main/package.json (blob 96e649b7f0f59ea15bc98e509ec1e005d99b0a27). Required and optional peer compatibility must come from shipped metadata, not guessed names.
- Tagged LICENSE: https://github.com/UI5/webcomponents-react/blob/v2.26.0/LICENSE (blob 261eeb9e9f8b2b4b0d119366dda99c6fd7d35c64).
- Tagged REUSE annotations: https://github.com/UI5/webcomponents-react/blob/v2.26.0/REUSE.toml (blob d5ea777c0c73410f3dba6828c61f9b63f8b70146). Default Apache-2.0 with listed exceptions; check file-specific notices before any redistribution.
- Installed metadata paths and SHA-256s are recorded in docs/evidence/p1-run-45777227065.json, derived from actual npm installations. Full catalog/token extraction is later work. This is not a C1 docs corpus or a legal clearance for scraping the live site.

Prefer the versioned licensed repository sources for the eventual documentation corpus rather than scraping a changing live documentation site. The live site's robots file and terms could not be verified in this session; do not crawl it or publish copied documentation until checked. Record source URLs, file licenses and snapshot hashes; do not redistribute packages, bundled assets or docs in the benchmark release without separate review.

## Related work and implementation decision

Reviewed https://github.com/christophhdesign/open-design-system-bench (README blob 4ed0e6673fb1c3bc82be548bb740d54c990eee99, package manifest blob 1983dc3a6d969d492f55597a37ed3b3e79cc22e4, version 1.5.0, LICENSE blob 8bdd991be62a03127af49ed20929278b721e7b30, MIT). Its README documents machine-readable catalog extraction, neutral prompts, context levels, fixture generation, static API/token/accessibility scoring, replay of stored diffs, reporting, and CLI or one-shot provider modes.

Decision: use this as a related-work reference and evaluate its extraction/fixture modules for reuse before P3; no code copied or imported so far. Do not substitute its static scores, context levels, CLI-only or one-shot conditions for our fixed protocol. Our P2 must prove actual rendered opportunity attribution, required-state interaction checks and axe/keyboard outcomes. P3 must prove budgeted isolated execution and deterministic evidence replay. Source-level security, dependency, licensing-notice and adapter compatibility review remains necessary before reuse.

## Evidence and gate

- First run: https://github.com/sai-prakash/ds-bench-de/actions/runs/45777227065. Both candidates installed and built successfully. Browser install failed because the floating Ubuntu image was unsupported by the pinned Playwright release. This is infrastructure failure, not UI5 failure. Archive 15096766175 contains exact lockfiles and full logs, with hashes in the evidence JSON.
- Corrective run: https://github.com/sai-prakash/ds-bench-de/actions/runs/45777381941 pins feasibility to ubuntu-24.04; browser outcome must be read from the completed run.
- Lockfile capture is not yet a frozen, committed dependency baseline. Record exact locks from a reviewed successful run, then replay with npm ci without fresh resolution.
- Ubuntu runner label is not an immutable Docker image digest. Docker reference-image validation and reproducible environment evidence remain mandatory before P1 closure.
- No task or model scores, no paid model calls, no release or ranking. Do not advance to P2 until actual browser execution and remaining P1 gates are reviewed.
