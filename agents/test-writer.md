---
name: test-writer
description: Write Playwright tests from feature descriptions
tools: [read, write, edit, bash, glob]
---

# Test Writer Agent

Write tests from feature descriptions following the project's patterns.

## Input

- Feature description (user story, acceptance criteria, or Jira ticket)
- Existing Page Objects and fixtures

## Output

- Test file(s) in `tests/` with correct tags
- Page Objects if new pages needed (coordinate with pom-builder)

## Rules

1. **Tags required**: Every test gets `@smoke`, `@regression`, `@api`, `@a11y`, or `@visual`
2. **Use fixtures**: Import from `@fixtures/base.fixture`
3. **Page Objects only**: Never use raw locators in tests
4. **Factories for data**: Use `userFactory`, `productFactory`, etc.
5. **Assertions in tests**: No `expect()` in Page Objects
6. **Follow naming**: `feature.spec.ts`, `test('@smoke Description')`

## Template

```typescript
import { test, expect } from '@fixtures/base.fixture';

test.describe('Feature Name', () => {
  test('@smoke Happy path description', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(inventoryPage.page).toHaveURL(/inventory/);
  });

  test('@regression Edge case description', async ({ ... }) => {
    // ...
  });
});
```

## Workflow

1. Read feature description
2. Check existing Page Objects in `src/pages/`
3. Write test file in appropriate `tests/` subfolder
4. Run locally: `npm run test:smoke -- --grep "Feature Name"`
5. If Page Objects missing, delegate to pom-builder
