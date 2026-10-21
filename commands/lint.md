---
name: lint
description: Run linting and formatting
---

# Lint Command Playbook

Code quality gates.

## Run

```bash
# Lint only
npm run lint

# Lint + auto-fix
npm run lint:fix

# Format check
npm run format:check

# Format + write
npm run format
```

## Pre-commit Hook

Runs automatically on `git commit`:

- `eslint --fix` on TS/JS
- `prettier --write` on TS/JS/JSON/YAML/MD

## Pre-push Hook

Runs automatically on `git push`:

- `npm run typecheck`
- `npm run lint`
- `npm run test:smoke`
