.PHONY: help install test typecheck leakage validate-tasks bench-smoke eval report calibrate

help:
	@echo "ds-bench-de targets"
	@echo "  make install         npm install"
	@echo "  make test            unit tests for validators"
	@echo "  make typecheck       tsc --noEmit"
	@echo "  make leakage         fail if task specs mention a system"
	@echo "  make validate-tasks  schema check on tasks/*"
	@echo "  make bench-smoke     1 system x 2 tasks x 1 condition x N=1 (Phase 2+)"
	@echo "  make eval            score stored generations (pure)"
	@echo "  make report          generate reports from results/*.json"
	@echo "  make calibrate       emit calibration sample for human rating (Phase 4)"

install:
	@echo "Phase 1 validators are zero-dep (Node >=22). npm install is reserved for Phase 2 Playwright/ts-morph."

test:
	npm test

typecheck:
	npm run typecheck

leakage:
	npm run leakage

validate-tasks:
	npm run validate-tasks

bench-smoke:
	@echo "GATE: Phase 1 does not generate. Sign-off specs first."
	@echo "After sign-off: npm run bench:smoke"
	npm run bench:smoke

eval:
	npm run eval

report:
	npm run report

calibrate:
	@echo "Phase 4 only. Calibration set is not generated until Tiers 0-3 exist."
	@exit 1
