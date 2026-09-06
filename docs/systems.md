# Design system inclusion decisions

Verification date: **2026-09-01**. Method: `npm view` against the public registry plus a public docs URL check. Vite installability is Phase 2.

Included (ranked once scores exist):

- sap-ui5 — @ui5/webcomponents-react@2.26.0 — MCP @ui5/webcomponents-mcp-server@0.1.2
- siemens-ix — @siemens/ix-react@5.2.1 — MCP @siemens/ix-mcp-react
- telekom-scale — @telekom/scale-components-react@3.0.0-beta.161 — NO_TOOLING (beta pin)
- porsche-ds — @porsche-design-system/components-react@4.6.0
- db-ux — @db-ux/react-core-components@5.2.1 — MCP + CLI

Baselines (not ranked): raw-html, shadcn-ui@4.19.1

Rejected: Bosch, Zalando, N26, Personio, Allianz, Deutsche Bank, Mercedes-Benz (no public installable React/WC kit or stale).

Noted, not added: @camunda/design-system — method change required.

Pins live in systems/<slug>/manifest.json. Do not bump mid-benchmark.
