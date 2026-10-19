# Contributing

Thank you for contributing! This project follows a standard GitHub flow with branch protection and required checks.

## Quick Start

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make changes
4. Run checks locally: `npm run typecheck && npm run lint && npm run test:smoke`
5. Push and open a PR

## Branch Naming

| Type     | Pattern                      | Example                        |
| -------- | ---------------------------- | ------------------------------ |
| Feature  | `feat/short-description`     | `feat/add-checkout-validation` |
| Bug Fix  | `fix/short-description`      | `fix/login-flake`              |
| Refactor | `refactor/short-description` | `refactor/page-object-base`    |
| Docs     | `docs/short-description`     | `docs/update-getting-started`  |
| Chore    | `chore/short-description`    | `chore/update-dependencies`    |

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `perf`, `ci`

Examples:

```
feat(saucedemo): add checkout validation tests
fix(api): handle 429 rate limit in RestfulBookerApi
refactor(pom): extract common waitForLoad logic
docs: update getting started with CI setup
chore(deps): upgrade playwright to 1.60
```

## Pull Request Process

1. **Title**: Use conventional commit format
2. **Description**: Explain what and why, link related issues
3. **Checks**: All required status checks must pass
4. **Review**: At least 1 approval required
5. **Merge**: Squash and merge (default)

## Code Standards

### TypeScript

- Strict mode enabled — no `any` without justification
- Use `type` over `interface` for unions/intersections
- Prefer `const` over `let`
- Explicit return types for public functions

### Playwright

- Follow POM patterns in `src/pages/`
- Use fixtures from `base.fixture.ts`
- Tag every test: `@smoke`, `@regression`, `@api`, `@a11y`, `@visual`
- Prefer `getByRole` → `getByTestId` → `getByLabel` → `getByText` → `locator`

### Testing

- **Smoke**: Critical path only, < 2 min total
- **Regression**: Full coverage, can be slow
- **API**: Contract + schema validation (zod)
- **A11y**: axe-core WCAG 2.1 AA
- **Visual**: Per-browser baselines, update via `npm run test:visual:update`

### Linting & Formatting

```bash
npm run lint        # Check
npm run lint:fix    # Auto-fix
npm run format      # Prettier write
npm run format:check # Prettier check
```

## Adding New Target Applications

1. Add base URL to `.env.example` and `playwright.config.ts`
2. Create Page Objects in `src/pages/your-app/`
3. Create API client in `src/api/` if needed
4. Add fixtures in `base.fixture.ts`
5. Write tests in `tests/your-app/`
6. Add CI environment variables to GitHub Secrets
7. Update README with new target

## Reporting Issues

- **Bug**: Use bug report template
- **Feature**: Use feature request template
- **Security**: See [SECURITY.md](SECURITY.md)

## Code of Conduct

Be respectful, inclusive, and constructive. This project follows the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
