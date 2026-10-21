# Visual Regression Tests

## Baseline Convention

```
tests/visual/
├── login-chromium.png
├── login-firefox.png
├── login-webkit.png
├── inventory-chromium.png
├── inventory-firefox.png
├── inventory-webkit.png
├── cart-chromium.png
├── cart-firefox.png
├── cart-webkit.png
├── checkout-chromium.png
├── checkout-firefox.png
└── checkout-webkit.png
```

- One baseline per page per browser
- Generated on Linux CI (ubuntu-latest)
- Naming: `{pageName}-{browser}.png`

## Updating Baselines

```bash
# Local (chromium only)
npm run test:visual:update

# CI: runs on all 3 browsers, commits updated baselines
```

## Thresholds

- `maxDiffPixels: 5000` — accommodates cross-platform rendering differences
- `threshold: 0.2` — 0.2% pixel difference allowed

## Masking

For dynamic content (timestamps, user names, ads):

```typescript
await expect(page).toHaveScreenshot('page-browser.png', {
  mask: [page.locator('.dynamic-timestamp')],
  maxDiffPixels: 5000,
});
```

## CI Behavior

- Runs on every push
- `continue-on-error: true` — doesn't block merge
- Artifacts uploaded: HTML report + screenshots
- Baselines committed to repo (not artifacts)

## Adding New Visual Test

1. Add test in `tests/visual/visual.spec.ts`
2. Run `npm run test:visual:update` locally
3. Commit new baselines
4. Push — CI validates on all 3 browsers
