---
name: jira-qa-run
description: End-to-end Jira QA runbook
---

# Jira QA Runbook

End-to-end QA cycle for a Jira ticket using the jira-qa-runner agent.

## Prerequisites

- `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_PROJECT_KEY` in GitHub secrets
- `mcp-atlassian` + `playwright-mcp` in `.mcp.json`
- Python + uv (`pip install uv` or `brew install uv`)

## Invocation

```
Use agents/jira-qa-runner to run the QA cycle for PROJ-123
```

## What Happens

```
Ticket PROJ-123
  → extract acceptance criteria (pull-jira-ticket skill)
  → generate Playwright test file(s) (write-test skill)
  → wait for environment to be ready (check-environment command)
  → run tests (run-tests skill)
  → if failing: attempt one self-heal (self-heal-test skill)
  → write run report to reports/runs/YYYY-MM-DD-PROJ-123.md (write-run-report skill)
  → if still failing: create [AUTO] Jira defect (create-jira-defect skill, dedup-checked)
  → store selector/flake patterns to memory (store-qa-memory skill)
```

## Outputs

- Test files in appropriate `tests/` subfolder
- Run report in `reports/runs/YYYY-MM-DD-PROJ-123.md`
- `[AUTO]` Jira defect if still failing (dedup-checked)
- Updated memory with selector/flake patterns

## Manual Alternative

If not using the agent, run each step manually:

```bash
# 1. Extract AC from Jira
# (use pull-jira-ticket skill or read ticket manually)

# 2. Write tests
# (use write-test skill)

# 3. Wait for env
npm run check-environment

# 4. Run tests
npm run test:smoke && npm run test:regression

# 5. Self-heal if needed
# (use self-heal-test skill)

# 6. Write report
# (use write-run-report skill)

# 7. Create defect if needed
# (use create-jira-defect skill)

# 8. Store patterns
# (use store-qa-memory skill)
```
