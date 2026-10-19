---
name: create-page-object
description: Create new Page Object class
---

# Create Page Object Skill

Create a new Page Object following repo patterns.

## Steps

1. **Create file** in `src/pages/YourPage.ts` (or `src/components/`)
2. **Extend `BasePage`** for full pages
3. **Private locators only** — never exposed to tests
4. **Implement `waitForLoad()`** — assert readiness with `waitFor`, not `expect`
5. **Intent-based methods** — `login()`, not `clickLoginButton()`
6. **No `expect()` in POM** — assertions belong in tests
7. **Register fixture** in `src/fixtures/base.fixture.ts`

## Template

```typescript
// src/pages/YourPage.ts
import { BasePage } from '../BasePage';

export class YourPage extends BasePage {
  protected readonly path = '/your-path';

  private readonly submitButton = this.page.getByRole('button', { name: 'Submit' });
  private readonly successMessage = this.page.getByTestId('success-message');

  async waitForLoad(): Promise<void> {
    await this.submitButton.waitFor({ state: 'visible' });
  }

  async submitForm(data: FormData): Promise<void> {
    await this.page.getByLabel('Email').fill(data.email);
    await this.page.getByLabel('Password').fill(data.password);
    await this.submitButton.click();
  }

  async getSuccessMessage(): Promise<string> {
    return (await this.successMessage.textContent()) ?? '';
  }
}
```

## Component Template (for reusable UI)

```typescript
// src/components/YourComponent.ts
import { Page } from '@playwright/test';

export class YourComponent {
  private readonly closeButton = this.page.getByRole('button', { name: 'Close' });

  constructor(private readonly page: Page) {}

  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
```

## Register Fixture

```typescript
// src/fixtures/base.fixture.ts
yourPage: async ({ page }, use) => {
  await use(new YourPage(page));
},
```

## Rules

- Locators: `private readonly`
- Methods: user intent names
- `waitForLoad()` required
- No `expect()` in POM
- No CSS/XPath selectors
- Run `npm run typecheck && npm run lint`
