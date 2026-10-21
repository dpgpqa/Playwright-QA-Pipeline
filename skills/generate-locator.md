---
name: generate-locator
description: Generate stable locator for a UI element
---

# Generate Locator Skill

Atomic capability: recommend stable locator for an element.

## Priority Order

1. `page.getByTestId('...')` — explicit contract with devs
2. `page.getByRole('button', { name: '...' })` — accessible
3. `page.getByLabel('...')` — form fields
4. `page.getByPlaceholder('...')` — inputs
5. `page.getByText('...')` — last resort
6. **Never** CSS/XPath in tests

## Usage

Ask dev to add `data-test="meaningful-name"` to element.
