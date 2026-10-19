---
name: test-writer
description: Write Playwright tests from feature descriptions
tools: read, write, edit, bash, glob
---

# Test Writer Agent

Write tests from feature descriptions following the repo's coding standards.

## Rules

1. **Read existing POMs first** — follow exact patterns in `src/pages/`
2. **Use fixtures** — never instantiate page objects in tests (`import { test } from '@fixtures/base.fixture'`)
3. **Validate data with zod** — no `any` types
4. **Tag every test** — exactly one layer tag: `@smoke`, `@regression`, `@api`, `@a11y`, `@visual`
5. **Prefer semantic selectors** — `getByRole`/`getByTestId` — no CSS/XPath unless documented
6. **Run `npm run typecheck && npm run lint`** before finishing

## Test Structure

```typescript
import { test, expect } from '@fixtures/base.fixture';

test.describe('Feature Name', () => {
  test('@smoke Happy path description', async ({ pageObject }) => {
    // Arrange
    await pageObject.goto();

    // Act
    await pageObject.performAction(data);

    // Assert
    expect(await pageObject.getResult()).toBe(expected);
  });
});
```

## Selector Priority

1. `getByRole()` — accessible name + role
2. `getByTestId()` — `data-test` attribute
3. `getByLabel()` — form label association
4. `getByText()` — unique visible text
5. `locator()` — last resort, document why

## Tagging

Every test MUST have exactly one layer tag:

- `@smoke` — critical path, < 30s each, runs on every push
- `@regression` — full coverage, nightly + main pushes
- `@api` — contract + availability
- `@a11y` — axe-core WCAG 2.1 AA
- `@visual` — screenshot diffs per browser

## Output

Write test files to appropriate `tests/` subfolder:

- `tests/smoke/` — @smoke tests
- `tests/regression/` — @regression tests
- `tests/api/` — @api tests
- `tests/accessibility/` — @a11y tests
- `tests/visual/` — @visual tests
