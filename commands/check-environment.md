---
name: check-environment
description: Poll BASE_URL until ready
---

# Check Environment

Poll the target environment until it's ready for testing.

## Commands

```bash
# Check all environments
npm run check-environment

# Check specific (via script)
node -e "
const { checkAllEnvironments } = require('./src/utils/environmentCheck.ts');
checkAllEnvironments().then(console.log);
"
```

## What It Does

Polls each `BASE_URL` with exponential backoff:

- Initial interval: 3s
- Max timeout: 30s per environment
- Returns `{ envName: boolean }` map

## Environment Variables

| Variable                   | Description          |
| -------------------------- | -------------------- |
| `SAUCEDEMO_BASE_URL`       | SauceDemo URL        |
| `RESTFUL_BOOKER_BASE_URL`  | Restful-Booker API   |
| `THE_INTERNET_BASE_URL`    | The Internet app     |
| `JSONPLACEHOLDER_BASE_URL` | JSONPlaceholder API  |
| `DEMOQA_BASE_URL`          | DemoQA app           |
| `ENV_CHECK_TIMEOUT_MS`     | Override 30s default |

## CI Usage

In `ci.yml`, `test-smoke` job runs `check-environment` implicitly via global setup.

## Manual Check

```bash
# Quick curl check
curl -s -o /dev/null -w "%{http_code}" https://your-staging-app.com
# Should return 200
```
