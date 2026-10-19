---
name: smoke
description: Quick smoke check playbook
---

# Quick Smoke Check

Run smoke tests for fast feedback (< 2 min).

## Commands

```bash
# Smoke only — chromium
npm run test:smoke

# With specific test
npm run test:smoke -- --grep "login"

# Repeat for flake check
npx playwright test --grep @smoke --repeat-each 3
```

## What Runs

- `@smoke` tagged tests only
- Chromium only (fastest)
- 2 workers (parallel)
- Critical paths: login, primary user journey, API health

## Expected

- 4-6 tests
- < 30s each
- < 2 min total
- Runs on every push + PR

## If Failures

```bash
# Debug with UI
npm run test:ui -- --grep @smoke

# Debug specific
npm run test:debug -- --grep "test name"

# Trace on failure
npx playwright test --grep @smoke --trace on
```
