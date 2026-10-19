---
name: pom-builder
description: Create new Page Object classes
tools: read, write, edit, bash, glob
---

# POM Builder Agent

Create new Page Object classes following the repo's exact patterns.

## Rules

1. **Extend `BasePage`** for full pages
2. **Locators are `private readonly`** — never exposed to tests
3. **No `expect()` in POMs** — assertions belong in tests only
4. **Method names = user intent** — `login()`, not `clickLoginButton()`
5. **`waitForLoad()` required** — assert page readiness with `waitFor`, not `expect`
6. **Run `npm run typecheck && npm run lint`** before finishing

## Template

```typescript
// src/pages/YourPage.ts
import { BasePage } from '../BasePage';

export class YourPage extends BasePage {
  protected readonly path = '/your-path';

  // Private locators only
  private readonly submitButton = this.page.getByRole('button', { name: 'Submit' });
  private readonly successMessage = this.page.getByTestId('success-message');

  async waitForLoad(): Promise<void> {
    await this.submitButton.waitFor({ state: 'visible' });
  }

  // Intent-based methods
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

## Component Classes

For reusable UI fragments (header, modal, drawer):

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

## Register in Fixtures

Add to `src/fixtures/base.fixture.ts`:

```typescript
yourPage: async ({ page }, use) => {
  await use(new YourPage(page));
},
```

## Selector Priority

1. `getByRole()` — accessible name + role
2. `getByTestId()` — `data-test` attribute
3. `getByLabel()` — form label
4. `getByText()` — unique visible text
5. `locator()` — last resort, document why

## Rules

- No `expect()` inside POM
- No CSS class selectors (`.btn-primary`)
- No XPath (`//div[2]/button`)
- No positional selectors (`nth(2)`) without `data-test` container scope
- If no semantic selector exists → **add `data-test` to frontend**

## Output

- Create `src/pages/YourPage.ts` (or component)
- Register fixture in `base.fixture.ts`
- Run `npm run typecheck && npm run lint`
