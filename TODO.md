# TODO — Adapt the Template Checklist

Use this checklist when adopting the template for your own app. Check off each item as you complete it.

## 🎯 Immediate (Before First Push)

- [ ] **Rename repo** — Update `package.json` name, README badges
- [ ] **Update `.env.example`** — Add your app's BASE_URLs, remove unused targets
- [ ] **Configure GitHub Secrets** — All required secrets from `SECURITY.md`
- [ ] **Enable GitHub Actions** — Settings → Actions → General
- [ ] **Set branch protection** — main branch, required checks
- [ ] **Run `npm install && npx playwright install --with-deps chromium`**
- [ ] **Run `npm run test:smoke`** — Verify pipeline works against demo sites
- [ ] **Push to your GitHub** — Verify CI passes

## 🏗️ Replace Demo Page Objects

- [ ] **Delete `src/pages/saucedemo/`** — Replace with your app's pages
- [ ] **Delete `src/pages/the-internet/`** — Replace with your app's pages
- [ ] **Delete `src/pages/demoqa/`** — Replace with your app's pages
- [ ] **Create your Page Objects** in `src/pages/your-app/`
  - [ ] Extend `BasePage`
  - [ ] Private locators only
  - [ ] Intent-based methods (`login()`, not `fillAndClick()`)
  - [ ] `waitForLoad()` with reliable indicator
- [ ] **Update `src/fixtures/base.fixture.ts`** — Register your page objects
- [ ] **Delete `src/components/saucedemo/`** — Add your shared components

## 🔌 Replace Demo API Clients

- [ ] **Delete `src/api/RestfulBookerApi.ts`** — Replace with your API client
- [ ] **Delete `src/api/JsonPlaceholderApi.ts`** — Replace with your API client
- [ ] **Create typed API wrappers** with zod schemas
  - [ ] Request/response schemas for each endpoint
  - [ ] Health check method
  - [ ] Auth handling (token refresh, etc.)
- [ ] **Add API fixtures** in `base.fixture.ts` if stateful

## 📝 Update Test Data

- [ ] **Update `test-data/users.json`** — Your test accounts
- [ ] **Update `test-data/products.json`** — Your test entities
- [ ] **Add zod schemas** in `src/utils/testData.ts` loaders
- [ ] **Create factories** in `src/factories/` for dynamic data

## 🧪 Write Your Tests

### Smoke Tests (Critical Path)
- [ ] Login / authentication
- [ ] Primary user journey (e.g., purchase, create record, submit form)
- [ ] Core API health checks
- [ ] Target: < 2 min total, runs on every push

### Regression Tests (Full Coverage)
- [ ] All CRUD operations
- [ ] Edge cases (validation, errors, empty states)
- [ ] Cross-browser (Chromium, Firefox, WebKit)
- [ ] Mobile viewports
- [ ] Tag with `@regression`

### API Tests
- [ ] Contract tests (schema validation)
- [ ] Auth scenarios (valid, expired, invalid, missing)
- [ ] Rate limiting / pagination / filtering
- [ ] Tag with `@api`

### Accessibility Tests
- [ ] `injectAxe(page)` in beforeEach
- [ ] `checkA11y(page)` on key pages
- [ ] Target: WCAG 2.1 AA
- [ ] Tag with `@a11y`

### Visual Tests
- [ ] Baseline screenshots per browser
- [ ] Key pages: login, dashboard, forms, lists
- [ ] Update via `npm run test:visual:update`
- [ ] Tag with `@visual`

## 🔧 Configuration

- [ ] **Update `playwright.config.ts`**
  - [ ] Projects (browsers, viewports)
  - [ ] Timeouts for your app
  - [ ] `baseURL` from env
  - [ ] Reporter settings
- [ ] **Update `lighthouserc.yml`** — Performance budgets for your app
- [ ] **Update `.zap/rules.tsv`** — Remove demo exclusions, add your rules
- [ ] **Update `.github/dependabot.yml`** — Your review/assignment preferences

## 📚 Documentation

- [ ] **Update `README.md`** — Your app, targets, badges
- [ ] **Update `GETTING_STARTED.md`** — Your setup steps
- [ ] **Update `CLAUDE.md`** — Any project-specific rules
- [ ] **Update `CONTRIBUTING.md`** — Your workflow
- [ ] **Update `SECURITY.md`** — Your contacts, threat model
- [ ] **Create `docs/contacts.md`** — Team, escalation, Jira keys, token rotation
- [ ] **Create `docs/flake-handling.md`** — Your flake taxonomy

## 🛡️ Security Hardening

- [ ] **Rotate demo credentials** — Use dedicated test accounts
- [ ] **Scope test accounts** — Minimal permissions, no prod access
- [ ] **Enable Dependabot alerts** — Settings → Security
- [ ] **Enable CodeQL** — Default on, verify in Security tab
- [ ] **Review ZAP rules** — Remove demo exclusions
- [ ] **Set Lighthouse budgets** — Realistic for your app

## 🚀 CI/CD Polish

- [ ] **Add Slack/Discord notifications** — `SLACK_WEBHOOK_URL` secret
- [ ] **Add Jira integration** — If using `agents/jira-qa-runner.md`
- [ ] **Configure merge queue** — If high PR volume
- [ ] **Add deployment gates** — Staging → Production
- [ ] **Set up scheduled regression** — Nightly cron in `ci.yml`

## 🧹 Cleanup

- [ ] **Remove unused target tests** — `tests/saucedemo/`, `tests/the-internet/`, etc.
- [ ] **Remove unused API tests** — `tests/restful-booker/`, `tests/jsonplaceholder/`
- [ ] **Remove unused demo data** — `test-data/` files you don't need
- [ ] **Remove demo references** from README, docs, comments

## ✅ Verification

- [ ] `npm run typecheck` — Passes
- [ ] `npm run lint` — Passes
- [ ] `npm run format:check` — Passes
- [ ] `npm run test:smoke` — Passes on your app
- [ ] `npm run test:regression` — Passes (or known failures documented)
- [ ] `npm run test:api` — Passes
- [ ] `npm run test:a11y` — Passes (or known issues documented)
- [ ] `npm run test:visual` — Passes (baselines created)
- [ ] CI pipeline — Green on push to main
- [ ] Security workflow — No critical findings

## 📦 Optional Enhancements

- [ ] **Add contract testing** — Pact or similar
- [ ] **Add load testing** — k6 or Artillery
- [ ] **Add contract testing** — Pact or similar
- [ ] **Add mutation testing** — Stryker
- [ ] **Add test case management** — Jira Xray, TestRail sync
- [ ] **Add dashboards** — Grafana + Playwright reporter
- [ ] **Add self-healing** — Extend `agents/triage.md`
- [ ] **Add AI test generation** — Extend `agents/test-writer.md`

---

**Tip**: Keep this file updated as you adapt. Delete items that don't apply, add your own.