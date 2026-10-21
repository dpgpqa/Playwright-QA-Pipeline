# Flake Handling

Taxonomy, playbook, and tooling for flaky tests.

## Flake Taxonomy

| Category        | Signal                           | Example                         |
| --------------- | -------------------------------- | ------------------------------- |
| **Timing**      | `TimeoutError`, intermittent     | Element not ready, API slow     |
| **Selector**    | `Element not found`, strict mode | UI changed, dynamic IDs         |
| **State**       | Data-dependent, order-dependent  | Cart not empty, user logged in  |
| **Environment** | Network, CI resource contention  | DNS, rate limits, slow disk     |
| **Concurrency** | Parallel test interference       | Shared auth state, localStorage |

## Playbook

### 1. Detect

- CI: `continue-on-error: true` on visual/regression
- Local: `npm run test:smoke` — flakes rarely appear locally
- Metrics: Track flake rate per test (target: < 1%)

### 2. Classify

Use `analyze-failure` skill to categorize.

### 3. Fix (Priority Order)

| Priority | Action                                                                    |
| -------- | ------------------------------------------------------------------------- |
| 1        | **Selector fix** — Update POM locator (use `generate-locator` skill)      |
| 2        | **Timing fix** — `expect.poll()`, increase timeout, wait for network idle |
| 3        | **State fix** — Better fixtures, `storageState`, `global.setup` reset     |
| 4        | **Environment fix** — Retry logic, longer timeouts, mock external deps    |
| 5        | **Quarantine** — Tag `@quarantine`, document, exclude from CI             |

### 4. Quarantine Process

```typescript
// Tag the test
test('@quarantine @regression Flaky checkout', async ({ ... }) => {
  // ...
});
```

Document in this file:

```markdown
## Quarantined Tests

| Test                             | Tagged     | Reason            | Owner  | Target Fix |
| -------------------------------- | ---------- | ----------------- | ------ | ---------- |
| @regression Checkout with coupon | 2026-01-15 | API latency > 30s | @zaito | 2026-02-01 |
```

### 5. Self-Heal (Automated)

- `self-heal-test` skill: one attempt on CI failure
- Only selector/timing fixes
- Logs all attempts
- Human review required after

## Tooling

| Tool                    | Purpose                                          |
| ----------------------- | ------------------------------------------------ |
| `expect.poll()`         | Async assertions with retry                      |
| `test.slow()`           | Triple timeout for known-slow tests              |
| `test.retry()`          | CI-only retries (config in playwright.config.ts) |
| `@quarantine` tag       | Exclude from required CI checks                  |
| `analyze-failure` skill | Classify and recommend fix                       |
| `self-heal-test` skill  | One-attempt auto-fix                             |

## Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0, // CI-only retries
  timeout: 30000,
  expect: { timeout: 5000 },
});
```

## Metrics Dashboard (Future)

Track per-test:

- Flake rate (failures / runs)
- Mean time to fix
- Quarantine duration
- Self-heal success rate
