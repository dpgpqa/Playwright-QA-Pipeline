---
name: generate-locator
description: Generate stable Playwright locator
---

# Generate Locator Skill

Generate stable, semantic Playwright locators following priority order.

## Priority Order

1. **`getByRole(role, { name })`** — accessible name + role (best for buttons, links, headings)
2. **`getByTestId(id)`** — `data-test` / `data-testid` attribute (add to frontend if missing)
3. **`getByLabel(label)`** — `<label>` association (form inputs)
4. **`getByPlaceholder(text)`** — placeholder text (inputs)
5. **`getByText(text, { exact: true })`** — unique visible text
6. **`locator(selector)`** — last resort, document why

## Examples

```typescript
// ✅ Best: role + accessible name
page.getByRole('button', { name: 'Submit' });

// ✅ Good: data-test attribute
page.getByTestId('submit-button');

// ✅ Good: form label
page.getByLabel('Email address');

// ❌ Avoid: CSS classes
page.locator('.btn-primary');

// ❌ Avoid: XPath
page.locator('//button[2]');

// ❌ Avoid: positional without data-test container
page.locator('button').nth(2);
```

## Rules

- If no semantic selector exists → **add `data-test` to frontend**
- `testIdAttribute` in `playwright.config.ts` is `data-test` (matches saucedemo)
- Change it to match your frontend's attribute
- Never use CSS classes, XPath, or positional selectors without documentation
