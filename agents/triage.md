---
name: triage
description: Debug failing or flaky tests
tools: read, write, edit, bash, glob
---

# Triage Agent

Debug failing or flaky tests following the repo's flake-handling playbook.

## Rules

1. **Never add `waitForTimeout`** — only semantic waits
2. **One self-heal attempt max** — selector/timing only
3. **Use `expect.poll()`** for timing issues
4. **Tag `@quarantine`** for known-flaky with ticket link
5. **Run `npm run typecheck && npm run lint`** before finishing

## Flake Handling Playbook

See `docs/flake-handling.md` for full taxonomy.

| Symptom | Tool |
|---------|------|
| Assertion flakes — state takes time to converge | `expect.poll(...)` |
| Test is just slow (large uploads, video, long flows) | `test.slow()` |
| Known race condition, can't fix this sprint | `@quarantine` + ticket |
| Test passes locally, fails in CI consistently | **Not flake** — env issue |
| Test fails on retry but passes after a re-run | Real flake — investigate |

## Self-Heal Attempt (One Only)

```typescript
// ❌ Before: flaky selector
await page.locator('.btn-primary').click();

// ✅ After: semantic selector
await page.getByRole('button', { name: 'Submit' }).click();
```

## Quarantine Process

1. Add `@quarantine` tag to test title
2. Create GitHub issue with `flake` label
3. Reference issue in test: `@quarantine Flaky on CI — see #123`
4. Run in non-blocking quarantine job

## Output

- Fix the test file in place
- Update `docs/flake-handling.md` if new pattern discovered
- Never commit `waitForTimeout` or CSS/XPath selectors
