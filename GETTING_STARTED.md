# Getting Started

Zero-to-CI walkthrough for the Playwright QA Pipeline.

## Prerequisites

- **Node.js** ≥ 20.11 (LTS)
- **npm** ≥ 10.x
- **Git** ≥ 2.40
- **GitHub account** (for CI/CD)

## 1. Clone & Install

```bash
git clone https://github.com/zaito/Playwright-QA-Pipeline.git
cd Playwright-QA-Pipeline
npm install
npx playwright install --with-deps chromium
```

## 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` if you need to override defaults:

```env
# Target your own app instead of demo sites
SAUCEDEMO_BASE_URL=https://your-app.com
SAUCEDEMO_USERNAME=your_user
SAUCEDEMO_PASSWORD=your_pass

RESTFUL_BOOKER_BASE_URL=https://your-api.com
THE_INTERNET_BASE_URL=https://your-app.com
JSONPLACEHOLDER_BASE_URL=https://your-api.com
DEMOQA_BASE_URL=https://your-app.com
```

**Never commit `.env.local`** — it's gitignored. Use GitHub Secrets for CI.

## 3. Run Smoke Tests

```bash
npm run test:smoke
```

Expected: ~4 tests pass in < 30 seconds against SauceDemo.

## 4. View Report

```bash
npm run report
```

Opens HTML report at `http://localhost:9323`.

## 5. Run Full Suite

```bash
# All layers, all browsers
npm test

# Or by layer
npm run test:regression   # Full E2E coverage
npm run test:api          # API contract tests
npm run test:a11y         # Accessibility
npm run test:visual       # Visual regression
```

## 6. Push to Your GitHub

```bash
# Create new repo on GitHub first, then:
git remote set-url origin https://github.com/YOUR_USERNAME/Playwright-QA-Pipeline.git
git push -u origin main
```

## 7. Enable GitHub Actions

1. Go to **Settings → Actions → General**
2. Enable "Allow all actions and reusable workflows"
3. Set **Workflow permissions** to "Read and write permissions"
4. Add secrets in **Settings → Secrets → Actions**:

| Secret                     | Value                    |
| -------------------------- | ------------------------ |
| `SAUCEDEMO_BASE_URL`       | Your app URL             |
| `SAUCEDEMO_USERNAME`       | Test username            |
| `SAUCEDEMO_PASSWORD`       | Test password            |
| `RESTFUL_BOOKER_BASE_URL`  | Your API URL             |
| `THE_INTERNET_BASE_URL`    | Your app URL             |
| `JSONPLACEHOLDER_BASE_URL` | Your API URL             |
| `DEMOQA_BASE_URL`          | Your app URL             |
| `SLACK_WEBHOOK_URL`        | (Optional) Slack alerts  |
| `LHCI_GITHUB_APP_TOKEN`    | (Optional) Lighthouse CI |

## 8. Configure Branch Protection

1. **Settings → Branches → Add rule**
2. Branch pattern: `main`
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (1+)
   - ✅ Require status checks to pass before merging
   - Select: `Lint & TypeCheck`, `Smoke Tests`, `Security`
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators

## 9. Run Locally Before Push

```bash
# Pre-push hook runs these automatically
npm run typecheck
npm run lint
npm run test:smoke
```

## Project Tour

```
src/
├── pages/           # Page Objects — your app's UI
│   ├── BasePage.ts  # Abstract base (goto, waitForLoad)
│   └── saucedemo/   # Example POMs
├── api/             # Typed API clients (zod schemas)
├── fixtures/        # Playwright extensions
│   ├── base.fixture.ts    # Page objects + auth
│   ├── global.setup.ts    # Pre-test env validation
│   └── global.teardown.ts # Post-test cleanup
├── factories/       # Typed test data builders
└── utils/           # Helpers (random, env check)

tests/
├── saucedemo/       # E2E + smoke + regression
├── restful-booker/  # API CRUD
├── the-internet/    # UI components
├── jsonplaceholder/ # API resources
├── demoqa/          # Complex UI (tables, forms)
├── accessibility/   # axe-core WCAG 2.1 AA
└── visual/          # Screenshot diffs

test-data/           # Static JSON (zod-validated)
```

## Writing Your First Test

1. **Create Page Object** in `src/pages/your-app/YourPage.ts`:

```typescript
export class YourPage extends BasePage {
  protected readonly path = '/your-path';
  private readonly submit = this.page.getByRole('button', { name: 'Submit' });

  async waitForLoad(): Promise<void> {
    await this.submit.waitFor({ state: 'visible' });
  }

  async submitForm(data: FormData): Promise<void> {
    // Fill fields...
    await this.submit.click();
  }
}
```

2. **Add fixture** in `src/fixtures/base.fixture.ts`:

```typescript
yourPage: async ({ page }, use) => {
  await use(new YourPage(page));
},
```

3. **Write test** in `tests/your-app/feature.spec.ts`:

```typescript
import { test, expect } from '@fixtures/base.fixture';

test.describe('Your Feature', () => {
  test('@smoke Happy path', async ({ yourPage }) => {
    await yourPage.goto();
    await yourPage.submitForm({ ... });
    await expect(yourPage.page).toHaveURL('/success');
  });
});
```

4. **Run it**:

```bash
npm run test:smoke -- --grep "Your Feature"
```

## Common Commands

| Task                    | Command                              |
| ----------------------- | ------------------------------------ |
| Install deps            | `npm install`                        |
| Install browsers        | `npx playwright install --with-deps` |
| Run smoke               | `npm run test:smoke`                 |
| Run regression          | `npm run test:regression`            |
| Run API tests           | `npm run test:api`                   |
| Run a11y                | `npm run test:a11y`                  |
| Run visual              | `npm run test:visual`                |
| Update visual baselines | `npm run test:visual:update`         |
| Open report             | `npm run report`                     |
| Merge sharded reports   | `npm run report:merge`               |
| TypeCheck               | `npm run typecheck`                  |
| Lint                    | `npm run lint`                       |
| Format                  | `npm run format`                     |
| Clean artifacts         | `npm run clean`                      |

## Troubleshooting

### Tests fail on CI but pass locally

- Check `BASE_URL` secrets are set in GitHub
- Verify network access to target URLs
- Increase timeouts in `playwright.config.ts`

### Visual tests fail

- Run `npm run test:visual:update` to regenerate baselines
- Ensure consistent browser versions (CI uses same Playwright version)
- Check `maxDiffPixels` threshold in config

### Flaky tests

- Use `expect.poll()` for async assertions
- Add `test.slow()` for known-slow tests
- Tag with `@quarantine` and handle in `docs/flake-handling.md`

### Auth issues

- Worker-scoped auth stores state in `.auth/` (gitignored)
- Run `npm run clean` to reset
- Check `global.setup.ts` / `global.teardown.ts`

## Next Steps

1. Replace demo Page Objects with your app's pages
2. Add API wrappers for your endpoints
3. Write smoke tests for critical paths
4. Add regression coverage
5. Configure visual baselines for your UI
6. Set up accessibility budgets
7. Add performance budgets in `lighthouserc.yml`
8. Customize security rules in `.zap/rules.tsv`

See [`TODO.md`](TODO.md) for the complete adaptation checklist.
