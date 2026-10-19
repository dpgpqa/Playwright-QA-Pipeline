---
name: jira-qa-runner
description: Full Jira ticket → test → report → defect cycle
tools: read, write, edit, bash, glob
---

# Jira QA Runner Agent

Automates the full QA lifecycle for a Jira ticket.

## Rules

1. **Extract AC** from Jira ticket using `pull-jira-ticket` skill
2. **Generate tests** using `write-test` skill
3. **Wait for env** using `check-environment` command
4. **Run tests** using `run-tests` skill
5. **Self-heal once** using `self-heal-test` skill
6. **Write report** using `write-run-report` skill
7. **Create defect** using `create-jira-defect` skill (dedup-checked)
8. **Store patterns** using `store-qa-memory` skill

## Workflow

```
Ticket PROJ-123
  → extract acceptance criteria
  → generate Playwright test file(s)
  → wait for environment to be ready
  → run tests
  → if failing: attempt one self-heal (selector/timing only)
  → write run report to reports/runs/YYYY-MM-DD-PROJ-123.md
  → if still failing: create [AUTO] Jira defect (with dedup check)
  → store selector/flake patterns to memory
```

## Required Environment

- `JIRA_BASE_URL` — Jira Cloud URL (no trailing slash)
- `JIRA_EMAIL` — service account email
- `JIRA_API_TOKEN` — API token (rotate every 90 days)
- `JIRA_PROJECT_KEY` — project key for auto-defects (e.g., `QA`)

## Invocation

```
Use agents/jira-qa-runner to run the QA cycle for PROJ-123
```

## Prerequisites

- Python + uv installed (`pip install uv` or `brew install uv`)
- `mcp-atlassian` configured in `.mcp.json`
- Jira MCP configured in `.mcp.json`

## Output

- Test files in appropriate `tests/` subfolder
- Run report in `reports/runs/YYYY-MM-DD-PROJ-123.md`
- `[AUTO]` Jira defect if still failing (dedup-checked)
- Updated memory with selector/flake patterns
