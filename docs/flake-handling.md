# Flake Handling Playbook

Taxonomy and playbook for handling flaky tests.

## Flake Taxonomy

| Type       | Symptom                          | Root Cause                     | Fix                    |
| ---------- | -------------------------------- | ------------------------------ | ---------------------- |
| **Timing** | Assertion fails, passes on retry | State takes time to converge   | `expect.poll(...)`     |
| **Slow**   | Test exceeds 30s but passes      | Large upload, video, long flow | `test.slow()`          |
| **Race**   | Intermittent, non-deterministic  | Shared state, CSRF, rate limit | `@quarantine` + ticket |
| **Env**    | Passes locally, fails CI         | Network, browser, config diff  | Not flake — env issue  |
| **Real**   | Fails on retry, passes re-run    | Genuine non-determinism        | Investigate            |

## Tools

| Symptom          | Tool                                        |
| ---------------- | ------------------------------------------- |
| Assertion flakes | `expect.poll(() => condition).toBeTruthy()` |
| Slow test        | `test.slow()`                               |
| Known race       | `@quarantine` + GitHub issue                |
| Env issue        | Fix CI config / network                     |
| Real flake       | Investigate — add trace, logs               |

## Self-Heal (One Attempt Max)

```typescript
// ❌ Before
await page.locator('.btn-primary').click();

// ✅ After: semantic selector
await page.getByRole('button', { name: 'Submit' }).click();

// ✅ Timing fix
await expect.poll(() => api.getStatus()).toBe('ready');
```

## Quarantine Process

1. **Add `@quarantine` tag** to test title
2. **Create GitHub issue** with `flake` label
3. **Reference in test**: `@quarantine Flaky on CI — see #123`
4. **Runs in non-blocking quarantine job** (auto-skipped when empty)

## Prevention

- **No `waitForTimeout`** — only semantic waits
- **No CSS/XPath** — semantic selectors only
- **Worker-scoped auth** — no shared session state
- **Factory data** — isolated per test
- **Reset app state** after each test
- **Trace on failure** — `npx playwright test --trace on`

## Review

- Monthly flake review in team sync
- Close fixed issues, update playbook
- Track flake rate (target: < 1%)
