---
name: self-heal-test
description: One-attempt selector/timing fix for a failing test
---

# Self-Heal Test Skill

Atomic capability: attempt one automatic fix for a failing test.

## Scope

**Only** these fix types:

- Selector changes (element moved, attribute changed)
- Timing adjustments (wait longer, poll)
- Data setup (missing factory data)

**Never** fix:

- Business logic changes
- API contract changes
- Architecture changes

## Process

1. Analyze failure with `analyze-failure`
2. If selector/timing:
   - Try alternative locator (role, text, test-id)
   - Increase timeout / add `expect.poll()`
   - Add missing factory data
3. Re-run test once
4. If passes → commit fix
5. If fails → tag `@quarantine`, escalate

## Safety

- Max 1 attempt per failure
- Only on CI failures (not local)
- Log all attempts for audit
- Human review required for `@quarantine`
