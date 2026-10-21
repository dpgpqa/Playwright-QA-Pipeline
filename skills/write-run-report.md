---
name: write-run-report
description: Write a QA run report to reports/runs/
---

# Write Run Report Skill

Atomic capability: generate run report markdown.

## Input

- Ticket ID
- Test results (pass/fail, errors)
- Environment info
- Artifacts (screenshots, traces)

## Output

- File: `reports/runs/YYYY-MM-DD-TICKET.md`

## Template

```markdown
# QA Run Report: TICKET-123

**Date**: 2026-01-15
**Ticket**: [TICKET-123](https://jira.company.com/browse/TICKET-123)
**Environment**: staging (BASE_URL)
**Commit**: abc1234

## Summary

- Tests run: 12
- Passed: 10
- Failed: 2
- Skipped: 0

## Failures

### Test: @regression Checkout with invalid coupon

**Error**: `TimeoutError: Expected URL /checkout-complete`
**Root cause**: Coupon validation API latency > 30s
**Fix**: Increase timeout or mock API

## Artifacts

- HTML Report: `reports/html/index.html`
- Screenshots: `test-results/...`
- Traces: `test-results/.../trace.zip`

## Next Steps

- [ ] Fix timeout in checkout test
- [ ] Add API mock for coupon validation
- [ ] Re-run after fix
```
