---
name: test
description: Full test suite run playbook
---

# Test Command Playbook

Run the complete test suite with reporting.

## Steps

1. **Pre-checks**

   ```bash
   npm run typecheck && npm run lint && npm run format:check
   ```

2. **Run all layers**

   ```bash
   npm test
   # Or per layer:
   npm run test:smoke
   npm run test:regression
   npm run test:api
   npm run test:a11y
   npm run test:visual
   ```

3. **View report**

   ```bash
   npm run report
   ```

4. **Merge sharded reports (CI)**
   ```bash
   npm run report:merge
   ```

## CI Equivalent

The `ci.yml` workflow runs:

- `lint-and-typecheck` → parallel test jobs → `merge-reports` → `notify`

## Debugging

```bash
# Headed mode
npm run test:headed

# Debug mode
npm run test:debug

# Specific test
npx playwright test --grep "test name" --project=chromium --headed
```
