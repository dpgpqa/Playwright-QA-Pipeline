---
name: create-page-object
description: Create a new Page Object class
---

# Create Page Object Skill

Atomic capability: create one Page Object class.

## Input

- Page name / URL path
- Key user actions
- Locator strategy (prefer `data-test`)

## Output

- Page Object file in `src/pages/`
- Fixture registration in `base.fixture.ts`

## Rules

- Extend `BasePage`
- Private locators only
- Methods = user verbs
- No `expect()` in POM
- Use `getByTestId()`
