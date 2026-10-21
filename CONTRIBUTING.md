# Contributing

Standards for pull requests — both human and AI-assisted.

## PR Workflow

1. **Branch** from `main`: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`
2. **Develop** with pre-commit hooks active (husky + lint-staged)
3. **Run locally** before push:
   ```bash
   npm run typecheck && npm run lint && npm run test:smoke
   ```
4. **Open PR** against `main` using the PR template
5. **CI must pass** — all required checks green
6. **Review** — at least 1 approval required
7. **Squash & merge** — keep history clean

## Coding Standards

### TypeScript

- Strict mode enabled (`tsconfig.json`)
- No `any` — use proper types or `unknown`
- Interfaces over type aliases for object shapes
- Zod schemas for all external data (API responses, env, test data)

### Playwright Tests

- Tags required: `@smoke`, `@regression`, `@api`, `@a11y`, `@visual`
- No `expect()` in Page Objects — tests own assertions
- Use `getByTestId()` — `testIdAttribute: 'data-test'`
- `await expect(...)` — always await assertions
- No hardcoded test data — use factories

### Page Objects

- Extend `BasePage`
- Private locators (`private readonly`)
- Methods = user verbs (`login`, `addToCart`, `checkout`)
- `waitForLoad()` waits for reliable page-ready indicator

### Commits

Conventional Commits:

```
feat: add checkout flow tests
fix: handle flaky login on slow CI
docs: update GETTING_STARTED with new secrets
refactor: extract common assertions to helper
chore: update dependencies
```

## AI-Assisted Development

- Follow `CLAUDE.md` rules
- Use agents/skills/commands for repetitive tasks
- Never commit AI-generated code without review
- PR description must explain _what_ and _why_, not just _how_

## Code Review Checklist

- [ ] TypeScript compiles
- [ ] Lint + format pass
- [ ] Smoke tests pass locally
- [ ] Tags correct on new tests
- [ ] POM rules followed
- [ ] No secrets in code
- [ ] Visual baselines updated if UI changed
- [ ] Documentation updated if behavior changed

## Reporting Issues

Use issue templates:

- Bug report
- Feature request
- Flaky test report
- Security vulnerability (see `SECURITY.md`)

## License

By contributing, you agree your contributions are licensed under the MIT License.
