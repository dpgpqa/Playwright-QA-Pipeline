---
name: write-run-report
description: Write QA run report to reports/runs/
---

# Write Run Report Skill

Write a QA run report to `reports/runs/YYYY-MM-DD-<ticket>.md`.

## Template

```markdown
# QA Run Report: PROJ-123

**Date:** 2024-01-15  
**Ticket:** [PROJ-123](https://jira.example.com/browse/PROJ-123)  
**Environment:** staging  
**Branch:** feat/PROJ-123-checkout-tests  
**Commit:** abc1234

## Test Summary

| Layer       | Tests | Passed | Failed | Skipped | Duration |
| ----------- | ----- | ------ | ------ | ------- | -------- |
| @smoke      | 4     | 4      | 0      | 0       | 45s      |
| @regression | 12    | 11     | 1      | 0       | 2m 30s   |
| @api        | 8     | 8      | 0      | 0       | 1m 15s   |
| @a11y       | 5     | 5      | 0      | 0       | 3m 20s   |
| @visual     | 6     | 6      | 0      | 0       | 4m 10s   |

## Failures

### @regression — Checkout with invalid card

**Error:** `TimeoutError: locator.fill: Timeout 15000ms exceeded.`

**Trace:** `test-results/regression-checkout-invalid-card/trace.zip`

**Status:** Self-heal attempted — selector fix applied. Re-running...

## Self-Heal Attempts

| Test                  | Original Selector        | Fixed Selector              | Result   |
| --------------------- | ------------------------ | --------------------------- | -------- |
| Checkout invalid card | `locator('.card-input')` | `getByLabel('Card number')` | ✅ Fixed |

## Defects Created

| Defect Key | Summary                                 | Status  |
| ---------- | --------------------------------------- | ------- |
| QA-456     | [AUTO] Checkout fails with invalid card | Created |

## Environment

- **BASE_URL:** https://staging.example.com
- **Browser:** Chromium 120
- **Playwright:** 1.64.1
- **Node:** 20.11

## Artifacts

- HTML Report: `reports/html/index.html`
- Traces: `test-results/*/trace.zip`
- Screenshots: `test-results/*/test-failed-*.png`
- Videos: `test-results/*/video.webm`
```

## Steps

1. **Run tests** with `--reporter=json` or collect from HTML report
2. **Summarize** pass/fail/skip by layer
3. **Document** failures with error, trace link, self-heal status
4. **Link** any created defects
5. **Save** to `reports/runs/YYYY-MM-DD-<ticket>.md`
