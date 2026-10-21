---
name: store-qa-memory
description: Persist QA patterns to memory for future runs
---

# Store QA Memory Skill

Atomic capability: save learned patterns.

## What to Store

| Pattern Type  | Example                                                               |
| ------------- | --------------------------------------------------------------------- |
| Selector fix  | "Login button changed from `#login` to `data-test=login-submit`"      |
| Flake pattern | "Cart page loads slow on Firefox CI, need +10s timeout"               |
| Timing adjust | "API `/checkout` takes 15-45s, use `expect.poll({ timeout: 60000 })`" |
| Data pattern  | "User factory needs `isActive: true` for new auth flow"               |

## Storage

- Project memory: `.claude/memory/` or skill-specific
- User memory: global preferences
- Session memory: current run patterns

## Format

```json
{
  "pattern": "selector-fix",
  "context": "LoginPage.login()",
  "old": "page.getByTestId('login-button')",
  "new": "page.getByTestId('login-submit')",
  "date": "2026-01-15",
  "ticket": "PROJ-123"
}
```

## Retrieval

- Agents read memory on startup
- `pom-builder` checks for known selector changes
- `triage` checks for known flake patterns
