---
name: write-test
description: Write a single Playwright test from a scenario description
---

# Write Test Skill

Atomic capability: write one test from a scenario.

## Input

- Scenario description (Given/When/Then or free text)
- Target test file path
- Available Page Objects and fixtures

## Output

- Test code appended to target file

## Rules

- Import from `@fixtures/base.fixture`
- Use correct tag (`@smoke`, `@regression`, `@api`, `@a11y`, `@visual`)
- Use factories for test data
- Assertions with `await expect()`
- No raw locators — Page Objects only
