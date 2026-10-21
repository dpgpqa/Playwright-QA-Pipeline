---
name: smoke
description: Quick smoke test run
---

# Smoke Command Playbook

Fast feedback — run only `@smoke` tests.

## Run

```bash
npm run test:smoke
```

## Expected

- ~3 tests
- < 30 seconds locally
- Runs on every push in CI

## When to Use

- Pre-push validation
- Quick CI check
- Post-deploy sanity check
