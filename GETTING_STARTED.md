# Getting Started

Zero-to-CI walkthrough for this QA automation template.

## Prerequisites

- Node.js ≥ 22 (see `engines` in `package.json`)
- GitHub account (for Actions, secrets, packages)
- Optional: Slack workspace (for failure notifications)

## 1. Clone & Install

```bash
git clone https://github.com/dpgpqa/Playwright-QA-Pipeline.git
cd Playwright-QA-Pipeline
npm install
npx playwright install --with-deps chromium
```

## 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```bash
# Target application (defaults to saucedemo.com)
BASE_URL=https://www.saucedemo.com

# Credentials (SauceDemo uses same password for all users)
TEST_USER=standard_user
TEST_USER_PASSWORD=secret_sauce
```

> **Never commit `.env.local`** — it's gitignored. Use GitHub Actions secrets for CI.

## 3. Run Smoke Tests

```bash
npm run test:smoke
```

Expected: 3 tests pass in ~5 seconds against saucedemo.com.

## 4. Open Report

```bash
npm run report
```

Opens the HTML report at `http://localhost:9323`.

## 5. Push & Watch CI

```bash
git push origin main
```

Go to **Actions** tab → **CI** workflow. You should see:

- Lint & TypeCheck ✅
- Smoke Tests ✅
- Regression Tests (3 browsers) ✅
- API Tests ✅
- Accessibility Tests ✅
- Visual Tests (3 browsers) ✅
- Merge Reports ✅

## 6. Add Repository Secrets

Settings → Secrets and variables → Actions → New repository secret:

| Secret               | Value                         | Required               |
| -------------------- | ----------------------------- | ---------------------- |
| `TEST_USER_PASSWORD` | `secret_sauce`                | **Yes**                |
| `SLACK_WEBHOOK_URL`  | `https://hooks.slack.com/...` | No (for notifications) |

## 7. Adapt to Your App

1. Change `BASE_URL` in `.env.local` (and GitHub secret)
2. Update page objects in `src/pages/` to match your UI
3. Update `data-test` attributes in your app or adjust locators
4. Add/remove tests in `tests/` to cover your flows
5. Update `lighthouserc.yml` budgets for your performance targets

## 8. Branch Protection (Recommended)

Settings → Branches → Add rule for `main`:

- Require status checks to pass before merging
- Require: `Lint & TypeCheck`, `Smoke Tests`, `Regression Tests`, `API Tests`, `Accessibility Tests`, `Visual Tests`
- Require pull request reviews before merging
- Dismiss stale PR approvals when new commits are pushed

## Next Steps

- Read `CLAUDE.md` for AI-assisted development rules
- Read `CONTRIBUTING.md` for human PR standards
- Check `TODO.md` for the adapt-the-template checklist
