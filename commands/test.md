---
name: test
description: Full test run playbook
---

# Full Test Run

Run the complete test suite with all layers.

## Commands

```bash
# Full suite, all browsers
npm test

# Or step by step
npm run typecheck && npm run lint && npm run test:smoke
npm run test:regression
npm run test:api
npm run test:a11y
npm run test:visual
npm run report:merge
npm run report
```

## CI Equivalent

The `ci.yml` workflow runs:

1. `lint-and-typecheck` (typecheck + eslint + prettier)
2. `test-smoke` + `test-api` (sharded, parallel)
3. `merge-smoke-report` (blob → HTML + JSON)
4. `test-regression` (nightly + main, cross-browser)
5. `test-accessibility` + `test-visual`
6. `merge-reports` (all blob reports → single HTML)
7. `notify` (Slack on failure)

## Local Debugging

```bash
# UI mode (interactive)
npm run test:ui

# Debug specific test
npm run test:debug -- --grep "test name"

# Headed browser
npm run test:headed

# Repeat for flake reproduction
npx playwright test --repeat-each 5 --grep "test name"

# Trace on failure
npx playwright test --trace on
npx playwright show-trace test-results/<test>/trace.zip
```
