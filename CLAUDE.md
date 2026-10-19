# CLAUDE.md — Coding Standards for AI Agents

This file defines the rules Claude (and reviewers) enforce on every PR. Human contributors should follow [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Non-Negotiable Rules

### 1. Page Object Model
- **Every page extends `BasePage`** — no raw `page.goto()` in tests
- **Locators are private** — tests call intent methods (`login()`, not `fill()` + `click()`)
- **No `expect()` in POMs** — assertions belong in tests only
- **Method names = user intent** — `loginAndWaitForInventory()`, not `fillAndClickAndWait()`

### 2. Fixtures Over Imports
- Page objects injected via `base.fixture.ts` — never `new LoginPage(page)` in tests
- Worker-scoped auth for login-once patterns
- API clients as fixtures when they hold state (tokens)

### 3. Test Data Validation
- **All static JSON loaded through `loadTestData()`** with zod schema
- **Factories for dynamic data** — `createShippingInfo()` not inline objects
- **No magic strings** — constants or test-data files only

### 4. Tagging Strategy (Required)
Every test **must** have exactly one layer tag:
- `@smoke` — Critical path, runs on every push (< 2 min total)
- `@regression` — Full coverage, nightly / on demand
- `@api` — Contract + availability
- `@a11y` — axe-core WCAG 2.1 AA
- `@visual` — Screenshot diffs
- `@quarantine` — Known flaky (see `docs/flake-handling.md`)

### 5. Selectors
- **Priority**: `getByRole()` → `getByTestId()` → `getByLabel()` → `getByText()` → `locator()`
- **No CSS/XPath** unless absolutely necessary (document why)
- **Data-testid** on all interactive elements in your app

### 6. Async Assertions
- Use `expect.poll()` for conditions that settle over time
- `await expect(locator).toBeVisible()` — not `waitFor()` + `expect()`
- Timeouts: default 10s, action 15s, navigation 30s

### 7. Visual Tests
- Baselines per-browser (`chromium/`, `firefox/`, `webkit/`)
- Update via `npm run test:visual:update` — never manually
- Threshold: `maxDiffPixels: 100`, `threshold: 0.2`

### 8. Accessibility
- Run `injectAxe(page)` in `beforeEach`
- Use `checkA11y(page)` with `detailedReport: true`
- Target: WCAG 2.1 AA (no `color-contrast` failures on demo sites)

### 9. API Tests
- Zod schema for every request/response
- Typed client class per API (see `RestfulBookerApi.ts`)
- Health check in `beforeAll`

### 10. Security
- **No secrets in code** — `.env.local` only, GitHub Secrets for CI
- `gitleaks` + `CodeQL` + `dependency-review` in CI
- OWASP ZAP baseline on PR

## File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Page Object | `PascalCasePage.ts` | `LoginPage.ts` |
| Component | `PascalCase.ts` | `Header.ts` |
| API Client | `PascalCaseApi.ts` | `RestfulBookerApi.ts` |
| Fixture | `*.fixture.ts` | `base.fixture.ts` |
| Factory | `*Factory.ts` | `shippingFactory.ts` |
| Test | `*.spec.ts` | `login.spec.ts` |
| Test Data | `*.json` | `users.json` |

## Import Aliases

```json
// tsconfig.json paths
"@/*": ["src/*"],
"@pages/*": ["src/pages/*"],
"@components/*": ["src/components/*"],
"@api/*": ["src/api/*"],
"@fixtures/*": ["src/fixtures/*"],
"@factories/*": ["src/factories/*"],
"@utils/*": ["src/utils/*"],
"@test-data/*": ["test-data/*"]
```

```typescript
// ✅ Correct
import { LoginPage } from '@pages/saucedemo/LoginPage';
import { test } from '@fixtures/base.fixture';

// ❌ Wrong
import { LoginPage } from '../../../src/pages/saucedemo/LoginPage';
```

## PR Checklist (Auto-Enforced)

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run format:check` passes
- [ ] `npm run test:smoke` passes
- [ ] New tests tagged correctly (`@smoke`/`@regression`/etc.)
- [ ] No `expect()` in Page Objects
- [ ] No hardcoded selectors in tests
- [ ] Zod schemas for new test data / API responses
- [ ] Visual baselines updated if UI changed
- [ ] Accessibility check added for new pages

## Flake Handling

See [`docs/flake-handling.md`](docs/flake-handling.md):
- `expect.poll()` for timing
- `test.slow()` for known-slow
- `@quarantine` tag + GitHub issue link
- One self-heal attempt (selector/timing only) via `agents/triage.md`

## Agent Instructions

When writing code in this repo:
1. Read existing POMs first — follow the exact pattern
2. Use fixtures — never instantiate page objects in tests
3. Validate data with zod — no `any`
4. Tag every test — exactly one layer tag
5. Prefer `getByRole`/`getByTestId` — no CSS unless documented
6. Run `npm run typecheck && npm run lint` before finishing