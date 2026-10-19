---
name: self-heal-test
description: One-attempt selector/timing fix for flaky test
---

# Self-Heal Test Skill

Attempt one self-heal fix for a flaky test (selector/timing only).

## Rules

- **One attempt max** — if it doesn't work, quarantine
- **Selector/timing only** — no logic changes
- **Never** add `waitForTimeout` or CSS/XPath selectors
- **Run `npm run typecheck && npm run lint`** after fix

## Common Fixes

| Failure                           | Fix                                            |
| --------------------------------- | ---------------------------------------------- |
| `locator('.btn-primary')` timeout | `getByRole('button', { name: 'Submit' })`      |
| `waitForTimeout(2000)`            | `expect.poll(() => condition).toBeTruthy()`    |
| `nth(2)` flakes                   | Add `data-test` to frontend, use `getByTestId` |
| Element not visible               | `expect(locator).toBeVisible()` auto-wait      |

## Process

1. **Read failure** — trace, screenshot, video
2. **Classify** per `docs/flake-handling.md`
3. **Apply one fix** (selector or timing)
4. **Verify** with `npm run test:smoke -- --grep "test name" --repeat-each 3`
5. **If fixed** — commit fix
6. **If not** — add `@quarantine` tag + GitHub issue

## Example

```typescript
// ❌ Before
await page.locator('.btn-primary').click();

// ✅ After
await page.getByRole('button', { name: 'Submit' }).click();
```
