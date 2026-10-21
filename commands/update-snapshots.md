---
name: update-snapshots
description: Update visual regression baselines
---

# Update Snapshots Command Playbook

Regenerate visual test baselines.

## Run

```bash
npm run test:visual:update
```

## What It Does

- Runs `@visual` tests with `--update-snapshots`
- Updates baseline images in `tests/visual/`
- Only for `chromium` by default (CI uses all 3 browsers)

## When to Use

- Intentional UI changes
- New visual tests added
- Baseline updates after browser version upgrade

## Workflow

1. Make UI changes
2. Run `npm run test:visual:update`
3. Review diff in Playwright report
4. Commit updated baselines
5. Push — CI will use new baselines

## Cross-Browser

CI generates baselines per browser (`-chromium.png`, `-firefox.png`, `-webkit.png`).
Local update only affects the project you run (default: chromium).
