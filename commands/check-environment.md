---
name: check-environment
description: Poll BASE_URL until ready
---

# Check Environment Command Playbook

Wait for target environment to be available before running tests.

## Usage

```bash
# Via Claude
Use commands/check-environment
```

## Logic

```typescript
// src/utils/environmentCheck.ts
export async function waitForEnvironment(
  url: string,
  maxRetries = 30,
  intervalMs = 10000
): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) return;
    } catch {}
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error(`Environment ${url} not ready after ${maxRetries} retries`);
}
```

## Called By

- `global.setup.ts` — before any tests
- `jira-qa-run` — before test execution
- Manual: `npm run check:env` (if script added)

## Configuration

- `maxRetries`: 30 (5 minutes default)
- `intervalMs`: 10000 (10 seconds)
- Override via env: `ENV_CHECK_RETRIES`, `ENV_CHECK_INTERVAL`
