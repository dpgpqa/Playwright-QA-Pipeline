---
name: run-tests
description: Run Playwright tests and capture results
---

# Run Tests Skill

Atomic capability: execute tests and return structured results.

## Input

- Test filter (grep, project, tag)
- Working directory

## Output

- Pass/fail count
- Failed test names with errors
- Artifacts: report, screenshots, traces

## Commands

```bash
# Smoke
npx playwright test --grep @smoke --project=chromium

# Full suite
npx playwright test

# Specific project
npx playwright test --project=firefox

# With report
npx playwright test --reporter=html
```

## CI Integration

- Results uploaded as artifacts
- Sharded reports merged in `merge-reports` job
- Failure summaries posted to PR (if configured)
