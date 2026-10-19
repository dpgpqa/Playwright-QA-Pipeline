# Visual Regression Baselines

## Convention

Per-browser baseline directories under `tests/visual/snapshots/`:

```
tests/visual/snapshots/
├── chromium/
│   ├── login-page.png
│   ├── inventory-page.png
│   └── cart-page.png
├── firefox/
│   ├── login-page.png
│   ├── inventory-page.png
│   └── cart-page.png
└── webkit/
    ├── login-page.png
    ├── inventory-page.png
    └── cart-page.png
```

## Naming

- `{page-name}-{state}.png` — descriptive, lowercase, kebab-case
- Examples: `login-page.png`, `inventory-page.png`, `checkout-step-one.png`

## Updating Baselines

```bash
# Update all browsers (run sequentially)
npm run test:visual:update -- --project=chromium
npm run test:visual:update -- --project=firefox
npm run test:visual:update -- --project=webkit
```

## Review

```bash
# View diffs
npm run report
```

## Threshold

Configured in `playwright.config.ts`:
- `maxDiffPixels: 100`
- `threshold: 0.2`

Adjust per-project as needed.
