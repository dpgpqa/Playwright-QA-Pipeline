---
name: store-qa-memory
description: Persist selector/flake patterns to Claude memory
---

# Store QA Memory Skill

Persist selector/flake patterns to Claude memory for future reference.

## What to Store

- **Selector fixes** — original → fixed mapping
- **Flake patterns** — test name, failure type, fix applied
- **Environment quirks** — timing issues, race conditions per env
- **Page object patterns** — reusable locator strategies

## Format

```json
{
  "selectorFixes": [
    {
      "original": "page.locator('.btn-primary')",
      "fixed": "page.getByRole('button', { name: 'Submit' })",
      "page": "CheckoutPage",
      "date": "2024-01-15"
    }
  ],
  "flakePatterns": [
    {
      "test": "Checkout with invalid card",
      "failure": "TimeoutError: locator.fill: Timeout 15000ms exceeded",
      "fix": "Changed to getByLabel('Card number')",
      "env": "staging",
      "date": "2024-01-15"
    }
  ],
  "envQuirks": [
    {
      "env": "staging",
      "issue": "Payment API takes 3-5s to respond under load",
      "workaround": "Increased navigationTimeout to 30s for checkout flow",
      "date": "2024-01-15"
    }
  ]
}
```

## Usage

```
Use skills/store-qa-memory to persist selector/flake patterns from PROJ-123 run
```

## Storage

Stored in Claude's persistent memory for this project. Available in future sessions for:
- Faster self-heal on similar failures
- Consistent selector patterns across team
- Environment-specific timing workarounds
