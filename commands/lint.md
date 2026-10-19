---
name: lint
description: Lint and format check playbook
---

# Lint & Format

Run all code quality checks.

## Commands

```bash
# TypeCheck (TypeScript)
npm run typecheck

# Lint (ESLint)
npm run lint
npm run lint:fix          # auto-fix

# Format (Prettier)
npm run format            # write
npm run format:check      # check only

# All gates (pre-push equivalent)
npm run typecheck && npm run lint && npm run format:check
```

## CI Gates

The `lint-and-typecheck` job runs all three:
- `tsc --noEmit` — strict mode, no errors
- `eslint .` — no violations
- `prettier --check .` — consistent formatting

## Pre-commit Hook

Automatic via husky + lint-staged:
- `eslint --fix` + `prettier --write` on staged files

## Skip (Emergency Only)

```bash
git commit --no-verify
# CI will catch you — don't make this a habit
```
