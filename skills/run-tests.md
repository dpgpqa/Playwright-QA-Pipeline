---
name: run-tests
description: Run Playwright tests with correct flags
---

# Run Tests Skill

Run Playwright tests with the correct flags for the situation.

## Commands

```bash
# Tag-based
npx playwright test --grep @smoke
npx playwright test --grep "@smoke|@api"
npx playwright test --grep-invert "@quarantine"

# Folder / file / test name
npx playwright test tests/regression/
npx playwright test tests/smoke/login.smoke.spec.ts
npx playwright test --grep "user can log in"

# Browser project
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Parallelism
npx playwright test --workers=1          # serial
npx playwright test --shard=1/4          # CI shard

# Visibility
npx playwright test --headed
npx playwright test --debug              # Playwright Inspector
npx playwright test --ui                 # Interactive UI mode

# Flake reproduction
npx playwright test --repeat-each 5 tests/smoke/login.smoke.spec.ts

# Failure analysis
npx playwright test --trace on
npx playwright show-trace test-results/<test>/trace.zip
npx playwright show-report reports/html

# Visual baselines
npx playwright test --grep @visual --project=chromium --update-snapshots
npx playwright test --grep @visual --project=firefox --update-snapshots
npx playwright test --grep @visual --project=webkit --update-snapshots

# Verify after generating
npx playwright test --grep @visual --project=chromium
```

## NPM Scripts

```bash
npm test                    # full suite, all browsers
npm run test:smoke          # @smoke only — chromium
npm run test:regression     # @regression only — chromium
npm run test:api            # API tests — chromium
npm run test:a11y           # accessibility — chromium
npm run test:visual         # visual diffs — chromium
npm run test:visual:update  # regenerate baselines
npm run test:ui             # Playwright UI mode
npm run test:debug          # Playwright Inspector
npm run test:headed         # full suite, browser visible
npm run report              # open last HTML report
npm run report:merge        # merge sharded blob reports
```
