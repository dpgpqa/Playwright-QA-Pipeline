# Adapt-the-Template Checklist

Replace demo app (SauceDemo) with your app.

## 1. Environment & Config

- [ ] Update `BASE_URL` in `.env.example` and GitHub secret
- [ ] Update credentials in `.env.example` and GitHub secrets
- [ ] Update `lighthouserc.yml` performance budgets
- [ ] Update `.zap/rules.tsv` for your app's security rules
- [ ] Verify `playwright.config.ts` projects match your browser matrix

## 2. Page Objects (`src/pages/`)

- [ ] Delete `LoginPage.ts`, `InventoryPage.ts`, `CartPage.ts`, `CheckoutInfoPage.ts`, `CheckoutOverviewPage.ts`, `CheckoutCompletePage.ts`
- [ ] Create your app's Page Objects (one per page/major flow)
- [ ] Update `BasePage` if needed (path, waitForLoad strategy)
- [ ] Update `Header.ts` component or create your shared components
- [ ] All locators use `getByTestId()` — add `data-test` to your app
- [ ] Methods = user verbs (`login`, `search`, `purchase`, etc.)

## 3. Fixtures (`src/fixtures/`)

- [ ] Update `base.fixture.ts` with your Page Objects
- [ ] Verify `global.setup.ts` auth flow matches your app
- [ ] Update `global.teardown.ts` cleanup if needed

## 4. API Clients (`src/api/`)

- [ ] Delete `RestfulBookerApiClient.ts` if not using RestfulBooker
- [ ] Create typed API clients for your endpoints
- [ ] Add Zod schemas for request/response validation

## 5. Factories (`src/factories/`)

- [ ] Update `userFactory.ts` for your user types
- [ ] Add factories for your domain entities
- [ ] All factories validated with Zod schemas

## 6. Test Data (`test-data/`)

- [ ] Add `users.json`, `products.json`, etc. for static data
- [ ] Validate with Zod in `src/utils/testData.ts`

## 7. Tests (`tests/`)

- [ ] Delete `smoke/`, `regression/`, `api/`, `accessibility/`, `visual/` demo tests
- [ ] Write `@smoke` tests for critical paths (login, core flow)
- [ ] Write `@regression` tests for full coverage
- [ ] Write `@api` tests for contract + availability
- [ ] Write `@a11y` tests for key pages
- [ ] Write `@visual` tests for key pages (update baselines: `npm run test:visual:update`)

## 8. Documentation

- [ ] Update `GETTING_STARTED.md` with your app details
- [ ] Update `CLAUDE.md` if POM patterns differ
- [ ] Update `CONTRIBUTING.md` if standards differ
- [ ] Fill `docs/contacts.md` with team contacts, Jira keys, escalation
- [ ] Update `docs/flake-handling.md` with your flake patterns

## 9. CI/CD

- [ ] Verify `.github/workflows/ci.yml` jobs match your needs
- [ ] Verify `.github/workflows/security.yml` rules
- [ ] Verify `.github/workflows/lighthouse.yml` budgets
- [ ] Add `dependabot.yml` for dependency updates
- [ ] Add `CODEOWNERS` for auto-reviewer assignment
- [ ] Add issue/PR templates in `.github/`

## 10. Integrations

- [ ] Add `JiraApi.ts` if using Jira
- [ ] Configure `.mcp.json` for AI browser control
- [ ] Add Slack webhook secret for notifications
- [ ] Set up branch protection rules

## 11. Final Verification

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run format:check` passes
- [ ] `npm run test:smoke` passes locally
- [ ] Push to main — all CI jobs pass
- [ ] Visual baselines committed
- [ ] No secrets in repo (run `gitleaks detect`)
