# Method (draft, pre-v1.0.0)

Version: `0.1.0-phase1`
Owner: Sai Prakash
Language: English. License: MIT.

This document is the source of truth for how scores are defined. Implementation lives under `eval/` and `harness/`. Numbers in reports must come from `results/*.json` via the report generator. Never typed by hand.

## Research question

Given an agent (an LLM with a fixed harness), how reliably can it produce correct, idiomatic, accessible UI using design system X, and how much does X's public documentation and tooling help?

We rank **design systems**, not models. Models are a controlled variable.

## Composite

```
ARS = 0.15*T0 + 0.25*T1 + 0.15*T2 + 0.25*T3 + 0.20*T4
```

Weights: `eval/weights.json`. A second leaderboard uses equal weights.

Until Tier 4 exists, publish per-tier scores only. Do not invent an ARS that silently drops T4.

## Conditions

| Id | Agent receives |
|----|----------------|
| C0 | Task spec + one line: Use design system X (package @scope/name). |
| C1 | C0 + top-8 BM25 pages from that system's scraped public docs, capped at 12k tokens. |
| C2 | C1 + official MCP / CLI / types tool if one exists. Else C2 = C1 and the run is tagged NO_TOOLING. |

C1-C0 estimates doc quality. C2-C1 estimates tooling value. C0 estimates prior knowledge.

## Models

Pinned IDs recorded at run time. Temperature 0. Fixed system prompt. Fixed max tokens.

- Claude Sonnet (exact ID in the run record)
- Claude Haiku (exact ID in the run record)
- One non-Anthropic model if OPENAI_API_KEY is set; otherwise SINGLE_VENDOR

N = 5 per (system x task x condition x model) in Phase 3. Phase 2 uses N = 2.

## Tiers

| Tier | What it measures | Score |
|------|------------------|-------|
| T0 | tsc --noEmit and vite build in a fresh Vite+TS template with the pinned package | 0 or 1 |
| T1 | DS usage ratio and hallucination rate via AST / custom-elements manifest | usage * (1 - hall. rate) |
| T2 | Token vs hard-coded colour/spacing/type; illegal overrides | tokens / (tokens + hard-codes) |
| T3 | Playwright runtime, checks.json, axe WCAG 2.1 AA, keyboard reachability | defined in eval/tiers/t3 |
| T4 | Blind rubric + pairwise judges, calibrated to human kappa >= 0.6 | 0-1 after normalisation |

Every tier ships with unit tests against known-good and known-bad fixtures.

## Validation before any public number

- Validator tests green
- Raw-HTML lowest on T1; shadcn in a plausible band
- Eval is deterministic on stored generations
- Leakage grep is clean
- Human kappa published for T4
- Threats written in docs/threats.md
