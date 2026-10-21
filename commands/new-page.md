---
name: new-page
description: Create a new page object and test from scratch
---

# New Page Command Playbook

End-to-end: create Page Object → fixture → test.

## Steps

1. **Create Page Object**

   ```bash
   # Use pom-builder agent or manually:
   # src/pages/YourPage.ts
   ```

2. **Register Fixture**

   ```typescript
   // src/fixtures/base.fixture.ts
   yourPage: async ({ page }, use) => {
     await use(new YourPage(page));
   },
   ```

3. **Write Test**

   ```typescript
   // tests/your-feature/feature.spec.ts
   import { test, expect } from '@fixtures/base.fixture';

   test.describe('Your Feature', () => {
     test('@smoke Happy path', async ({ yourPage }) => {
       await yourPage.goto();
       // ...
     });
   });
   ```

4. **Run & Verify**
   ```bash
   npm run test:smoke -- --grep "Your Feature"
   ```

## Checklist

- [ ] Page Object extends `BasePage`
- [ ] Private locators only
- [ ] Methods = user verbs
- [ ] `waitForLoad()` waits for reliable indicator
- [ ] Fixture registered
- [ ] Test tagged correctly
- [ ] Uses factories for data
