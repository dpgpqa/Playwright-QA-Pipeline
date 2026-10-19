---
name: new-page
description: Create new Page Object playbook
---

# Create New Page Object

Step-by-step playbook for adding a new page to the test suite.

## Steps

```bash
# 1. Create Page Object
# src/pages/YourPage.ts
# Extend BasePage, private locators, intent methods, waitForLoad()

# 2. Register fixture
# src/fixtures/base.fixture.ts
# yourPage: async ({ page }, use) => { await use(new YourPage(page)); }

# 3. Write tests
# tests/regression/your-feature.spec.ts
# Import from @fixtures/base.fixture
# Tag with @smoke or @regression

# 4. Run gates
npm run typecheck && npm run lint && npm run test:smoke

# 5. Commit
git add src/pages/YourPage.ts src/fixtures/base.fixture.ts tests/regression/your-feature.spec.ts
git commit -m "feat(pom): add YourPage for your-feature"
```

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

## Fixture Registration

```typescript
// src/fixtures/base.fixture.ts
yourPage: async ({ page }, use) => {
  await use(new YourPage(page));
},
```

## Test Template

```typescript
// tests/regression/your-feature.spec.ts
import { test, expect } from '@fixtures/base.fixture';

test.describe('Your Feature', () => {
  test('@regression Happy path', async ({ yourPage }) => {
    await yourPage.goto();
    await yourPage.submitForm({ email: 'test@example.com', password: 'secret' });
    expect(await yourPage.getSuccessMessage()).toContain('Welcome');
  });
});
```

## Gates

```bash
npm run typecheck && npm run lint && npm run test:smoke
```
