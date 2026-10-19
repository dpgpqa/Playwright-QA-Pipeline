---
name: update-snapshots
description: Update visual regression baselines
---

# Update Visual Snapshots

Regenerate per-browser visual baselines.

## Commands

```bash
# Update all browsers (run sequentially)
npm run test:visual:update -- --project=chromium
npm run test:visual:update -- --project=firefox
npm run test:visual:update -- --project=webkit

# Or use the script
npm run test:visual:update
```

## Process

1. **Run update** — creates new baseline images in `tests/visual/snapshots/<browser>/`
2. **Review diffs** — `npm run report` to compare old vs new
3. **Commit baselines** — `git add tests/visual/snapshots/ && git commit`

## Baseline Convention

```
tests/visual/snapshots/
├── chromium/
│   ├── login-page.png
│   └── dashboard-page.png
├── firefox/
│   ├── login-page.png
│   └── dashboard-page.png
└── webkit/
    ├── login-page.png
    └── dashboard-page.png
```

## When to Update

- Intentional UI changes (new feature, redesign)
- Baseline drift (font rendering, browser updates)
- New browser version in CI

## Threshold

Configured in `playwright.config.ts`:
- `maxDiffPixels: 100`
- `threshold: 0.2`

Adjust per-project as needed.
