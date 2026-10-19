---
name: write-test
description: Write Playwright test from feature description
---

# Write Test Skill

Write a Playwright test from a feature description following repo patterns.

## Steps

1. **Read existing POMs** in `src/pages/` for the target page
2. **Check fixtures** in `src/fixtures/base.fixture.ts` for available page objects
3. **Write test** using the exact pattern:
   - Import from `@fixtures/base.fixture`
   - Use page object methods (intent-based, not raw locators)
   - Tag with exactly one layer tag: `@smoke`, `@regression`, `@api`, `@a11y`, `@visual`
   - Arrange → Act → Assert structure
4. **Validate** with `npm run typecheck && npm run lint`

## Template

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

## Rules

- No `any` types
- No `waitForTimeout`
- No CSS/XPath selectors
- No `expect()` in POMs
- Tag every test with exactly one layer tag
