# CLAUDE.md

Coding standards, agent rules, and POM patterns enforced on every PR — for AI agents and human reviewers.

## Core Principles

1. **One framework, all layers.** Playwright handles E2E, API, visual, a11y. No extra runners.
2. **Fast feedback first.** Smoke + API < 2 min on every push. Full regression nightly/on-demand.
3. **Enterprise defaults.** Worker-scoped auth, Zod-validated test data, typed factories, pre-commit hooks, CodeQL + gitleaks + dependency review, sharded reports merged to single HTML, PR comments with failure summaries.
4. **Free by default.** GitHub Actions, Playwright, axe-core, OWASP ZAP, Lighthouse CI, CodeQL, Dependabot, gitleaks — all free for public repos.
5. **You own it.** This is not a framework you import. Every file is yours to modify.

## Page Object Model Rules

### Base Class Contract

Every page extends `BasePage` and implements:

```typescript
export abstract class BasePage {
  constructor(protected readonly page: Page) {}
  protected abstract readonly path: string;
  async goto(): Promise<Response | null> {
    const res = await this.page.goto(this.path);
    await this.waitForLoad();
    return res;
  }
  abstract waitForLoad(): Promise<void>;
  url(): string {
    return this.page.url();
  }
}
```

### Page Class Pattern

```typescript
export class LoginPage extends BasePage {
  protected readonly path = '/';

  // Private locators — never exposed to tests
  private readonly username = this.page.getByTestId('username');
  private readonly password = this.page.getByTestId('password');
  private readonly submit = this.page.getByTestId('login-button');
  private readonly error = this.page.getByTestId('error');
  private readonly logo = this.page.locator('.login_logo');

  async waitForLoad(): Promise<void> {
    await this.logo.waitFor({ state: 'visible' });
  }

  // Method names = user intent, not implementation
  async login(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submit.click();
  }

  async loginAndWaitForInventory(username: string, password: string): Promise<void> {
    await this.login(username, password);
    await this.page.waitForURL('**/inventory.html');
  }

  async getErrorMessage(): Promise<string> {
    return (await this.error.textContent()) ?? '';
  }
}
```

### Rules

| Rule                                                           | Enforcement          |
| -------------------------------------------------------------- | -------------------- |
| No `expect()` in POMs                                          | Tests own assertions |
| Locators are `private readonly`                                | Encapsulation        |
| Method names = user verbs (`login`, `addToCart`, `checkout`)   | Readable tests       |
| `waitForLoad()` waits for a **reliable** page-ready indicator  | No flake             |
| Use `getByTestId()` — `testIdAttribute: 'data-test'` in config | Stable selectors     |
| Components for shared UI (`Header`, `Footer`, `Sidebar`)       | Reuse                |

## Fixtures & Worker-Scoped Auth

```typescript
// base.fixture.ts
export const test = base.extend<{ loginPage: LoginPage; inventoryPage: InventoryPage }>({
  loginPage: async ({ page }, use) => await use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => await use(new InventoryPage(page)),
  // worker-scoped auth via storageState
  storageState: async ({}, use, workerInfo) => {
    const authFile = `.auth/user-${workerInfo.workerIndex}.json`;
    await use(authFile);
  },
});
```

- `global.setup.ts`: validates env, logs in once per worker, saves `.auth/user-{index}.json`
- `global.teardown.ts`: cleans up auth files on CI

## Test Data & Factories

- **Factories** in `src/factories/` — typed builders with Zod schemas
- **Static JSON** in `test-data/` — loaded & validated at startup via `testData.ts`
- **Never hardcode** test data in tests

```typescript
// userFactory.ts
export const userFactory = {
  standard: () => ({ username: 'standard_user', password: 'secret_sauce' }),
  lockedOut: () => ({ username: 'locked_out_user', password: 'secret_sauce' }),
  // ... validated against Zod schema
};
```

## Tagging Strategy

| Tag           | Purpose                          | CI               |
| ------------- | -------------------------------- | ---------------- |
| `@smoke`      | Critical path, < 2 min total     | Every push       |
| `@regression` | Full coverage, nightly           | Nightly / PR     |
| `@api`        | Contract + availability          | Every push       |
| `@a11y`       | axe-core WCAG 2.1 AA             | Every push       |
| `@visual`     | Screenshot diffs                 | Every push       |
| `@quarantine` | Known flaky — handled separately | Excluded from CI |

Run: `npx playwright test --grep @smoke`

## Flake Handling

See `docs/flake-handling.md`:

- `expect.poll()` for async assertions
- `test.slow()` for known-slow tests
- `@quarantine` tag + dedicated handling
- One self-heal attempt (selector/timing only) via `self-heal-test` skill

## Security

- **Never** commit secrets — use GitHub Secrets
- `SECURITY.md` defines threat model & reporting
- Pre-commit: gitleaks scan
- CI: CodeQL, npm audit, dependency-review, OWASP ZAP

## PR Checklist (AI & Human)

- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] Lint passes (`npm run lint`)
- [ ] Format passes (`npm run format:check`)
- [ ] Smoke tests pass locally (`npm run test:smoke`)
- [ ] New tests tagged correctly (`@smoke`/`@regression`/etc.)
- [ ] Page Objects follow POM rules above
- [ ] No `expect()` in POMs
- [ ] Locators use `getByTestId()` where possible
- [ ] Test data from factories, not hardcoded
- [ ] Visual baselines updated if UI changed (`npm run test:visual:update`)

## Agents, Skills, Commands

| Folder      | Purpose                                                                                                                                      |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `agents/`   | Role-shaped agents (test-writer, triage, pom-builder, jira-qa-runner)                                                                        |
| `skills/`   | Atomic capabilities (write-test, create-page-object, analyze-failure, pull-jira-ticket, self-heal-test, create-jira-defect, store-qa-memory) |
| `commands/` | Step-by-step playbooks (test, smoke, lint, update-snapshots, new-page, jira-qa-run, check-environment)                                       |

Invoke via Claude: `Use agents/jira-qa-runner to run QA cycle for PROJ-123`

## Jira Integration

- `src/api/JiraApi.ts` — typed REST wrapper (getTicket, createDefect, addComment, transitions)
- `jira-qa-runner` agent: ticket → AC extraction → test gen → run → report → defect (dedup-checked)
- Requires `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` secrets

## MCP (Model Context Protocol)

`.mcp.json` configures `@playwright/mcp` for AI browser control:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Enables: `browser_navigate`, `browser_click`, `browser_type`, `browser_snapshot`, etc. in AI chats.
