## Description

Brief description of what this PR does.

## Related Issue/Ticket

Closes: PROJ-123
Relates to: PROJ-456

## Type of Change

- [ ] 🐛 Bug fix
- [ ] ✨ New feature / test coverage
- [ ] ♻️ Refactor (no functional change)
- [ ] 📝 Documentation
- [ ] 🔧 Chore / config
- [ ] 🧪 Test only

## Test Layer Tags

Every new test MUST have exactly one layer tag:

- [ ] `@smoke` — Critical path, runs on every push
- [ ] `@regression` — Full coverage, nightly + main
- [ ] `@api` — Contract + availability
- [ ] `@a11y` — Accessibility (axe-core)
- [ ] `@visual` — Screenshot diffs
- [ ] `@quarantine` — Known flaky (with issue link)

## Test Quality Checklist

- [ ] Tests are tagged with exactly one layer tag
- [ ] No `waitForTimeout` — only semantic waits (`expect.poll`, `expect(...).toBeVisible()`)
- [ ] No CSS class selectors (`.btn-primary`) or XPath (`//button[2]`)
- [ ] No `any` types — use specific types or `unknown`
- [ ] No credentials in source code — `process.env.*` only
- [ ] No `expect()` calls inside Page Objects
- [ ] Every test is self-contained — no execution-order dependencies
- [ ] `@smoke` tests run in under 30s each

## Page Object Quality (if modified)

- [ ] Locators are `private readonly`
- [ ] Methods named for user intent (`login()`, not `clickLoginButton()`)
- [ ] `waitForLoad()` implemented with `waitFor`, not `expect`
- [ ] No `expect()` calls inside the POM

## Code Quality

- [ ] `npm run typecheck` passes — no TypeScript errors
- [ ] `npm run lint` passes — no ESLint violations
- [ ] `npm run format:check` passes — or run `npm run format` to auto-fix
- [ ] `npm run test:smoke` passes against staging/test environment

## Security

- [ ] No `.env.local`, `.auth/*`, or token values added
- [ ] No new dependencies without justification (check `package-lock.json` diff)
- [ ] No hardcoded URLs pointing to production environments

## Documentation

- [ ] New page objects reflected in `README.md` layout (if structure changed)
- [ ] New env vars added to `.env.example` and `CLAUDE.md` knobs table
- [ ] New test type added → CI workflow updated to run it
- [ ] `CLAUDE.md` updated if coding standards changed

## Screenshots / Traces (if visual/UI changes)

| Test | Before | After |
|------|--------|-------|
| Test name | ![before](url) | ![after](url) |

## Deploy Notes

- [ ] No deploy needed (test-only changes)
- [ ] Requires staging deploy first
- [ ] Requires prod deploy coordination
