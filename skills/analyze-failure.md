---
name: analyze-failure
description: Analyze test failure and propose fix
---

# Analyze Failure Skill

Analyze a failing test and propose a fix following the flake-handling playbook.

## Steps

1. **Read the error** — trace, screenshot, video, error-context.md
2. **Classify** using `docs/flake-handling.md` taxonomy
3. **Propose fix** — one self-heal attempt max (selector/timing only)
4. **Never** add `waitForTimeout` or CSS/XPath selectors

## Classification

| Symptom | Fix |
|---------|-----|
| Assertion flakes — state takes time | `expect.poll(...)` |
| Test is just slow | `test.slow()` |
| Known race, can't fix now | `@quarantine` + ticket |
| Passes locally, fails CI | Env issue — not flake |
| Fails on retry, passes after re-run | Real flake — investigate |

## Self-Heal (One Attempt)

```typescript
// ❌ Before
await page.locator('.btn-primary').click();

// ✅ After
await page.getByRole('button', { name: 'Submit' }).click();

// ✅ Timing fix
await expect.poll(() => api.getStatus()).toBe('ready');
```

## Quarantine Process

1. Add `@quarantine` tag to test
2. Create GitHub issue with `flake` label
3. Reference in test: `@quarantine Flaky on CI — see #123`
