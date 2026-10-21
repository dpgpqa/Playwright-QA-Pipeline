---
name: pom-builder
description: Create new Page Object classes
tools: [read, write, edit, bash, glob]
---

# POM Builder Agent

Create Page Object classes following the project's strict patterns.

## Input

- Page name / URL path
- Key user actions on that page
- Locators needed (prefer `data-test` attributes)

## Output

- Page Object class in `src/pages/`
- Updated `base.fixture.ts` with new fixture

## Rules

1. **Extend `BasePage`** — implement `path` and `waitForLoad()`
2. **Private locators only** — `private readonly` fields
3. **Methods = user verbs** — `login()`, `addToCart()`, `checkout()`
4. **No `expect()`** — tests own assertions
5. **Return `void` or data** — never return locators
6. **Use `getByTestId()`** — `testIdAttribute: 'data-test'`

## Template

```typescript
import { BasePage } from './BasePage';

export class YourPage extends BasePage {
  protected readonly path = '/your-path';

  // Private locators
  private readonly submitButton = this.page.getByTestId('submit');
  private readonly successMessage = this.page.getByTestId('success');

  async waitForLoad(): Promise<void> {
    await this.submitButton.waitFor({ state: 'visible' });
  }

  // User intent methods
  async submitForm(data: FormData): Promise<void> {
    // Fill fields using private locators
    await this.submitButton.click();
  }

  async getSuccessMessage(): Promise<string> {
    return (await this.successMessage.textContent()) ?? '';
  }
}
```

## Fixture Registration

Add to `src/fixtures/base.fixture.ts`:

```typescript
yourPage: async ({ page }, use) => {
  await use(new YourPage(page));
},
```

## Locator Priority

1. `getByTestId('...')` — stable, explicit contract
2. `getByRole('button', { name: '...' })` — accessible
3. `getByLabel('...')` — form fields
4. `getByText('...')` — last resort
5. **Never** CSS/XPath selectors in tests
