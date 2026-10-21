---
name: jira-qa-run
description: End-to-end Jira QA cycle playbook
---

# Jira QA Run Playbook

Full ticket → test → report → defect cycle.

## Prerequisites

- `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` secrets
- `src/api/JiraApi.ts` configured
- `agents/jira-qa-runner.md` available

## Invoke

```bash
# Via Claude
Use agents/jira-qa-runner to run QA cycle for PROJ-123
```

## Manual Steps (if not using agent)

### 1. Pull Ticket

```bash
# Extract AC from Jira
# Parse into testable scenarios
```

### 2. Generate Tests

```bash
# Create test file(s) from AC
# Create Page Objects if needed
```

### 3. Wait for Environment

```bash
# Poll BASE_URL until ready
npx playwright test --grep @smoke --project=chromium
```

### 4. Run Tests

```bash
npm run test:smoke
npm run test:regression
# etc.
```

### 5. Self-Heal (One Attempt)

```bash
# If selector/timing failures only
# Fix and re-run once
```

### 6. Write Run Report

```bash
# reports/runs/YYYY-MM-DD-PROJ-123.md
```

### 7. Create Defect (If Failing)

```bash
# Dedup check → create defect → link to ticket
```

### 8. Store Patterns

```bash
# Save selector fixes, flake patterns to memory
```
