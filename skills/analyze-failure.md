---
name: analyze-failure
description: Analyze a test failure and determine root cause
---

# Analyze Failure Skill

Atomic capability: classify failure and recommend fix.

## Failure Categories

| Category    | Signals                                      | Action                            |
| ----------- | -------------------------------------------- | --------------------------------- |
| Selector    | `Element not found`, `Strict mode violation` | Update POM locator                |
| Timing      | `TimeoutError`, intermittent pass/fail       | `expect.poll()`, increase timeout |
| Data        | `AssertionError` on data                     | Fix factory, reset state          |
| Environment | `ECONNREFUSED`, `DNS`                        | Check `BASE_URL`, network         |
| Flake       | Non-deterministic, no code change            | Tag `@quarantine`, document       |

## Output

- Category
- Root cause hypothesis
- Fix recommendation
- Code change if straightforward
