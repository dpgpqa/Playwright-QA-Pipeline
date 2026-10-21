# Pull Request

## Description

Brief summary of changes.

## Type

- [ ] Feature (new test, page object, factory)
- [ ] Fix (bug, flake, selector)
- [ ] Refactor (no behavior change)
- [ ] Docs (README, CLAUDE, GETTING_STARTED, etc.)
- [ ] Chore (deps, config, CI)
- [ ] Security

## Testing

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run format:check` passes
- [ ] `npm run test:smoke` passes locally
- [ ] New tests tagged correctly (`@smoke`, `@regression`, `@api`, `@a11y`, `@visual`)
- [ ] Visual baselines updated if UI changed (`npm run test:visual:update`)

## Checklist

- [ ] Follows POM rules (CLAUDE.md)
- [ ] No `expect()` in Page Objects
- [ ] Locators use `getByTestId()` where possible
- [ ] Test data from factories, not hardcoded
- [ ] No secrets committed
- [ ] Documentation updated if behavior changed
- [ ] Conventional commit messages

## Related

- Closes # (issue number)
- Related to # (issue number)

## Screenshots / Traces

(If visual changes or test failures)
