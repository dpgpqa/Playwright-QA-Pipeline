---
name: create-jira-defect
description: Create a Jira defect with dedup check
---

# Create Jira Defect Skill

Atomic capability: file defect in Jira.

## Input

- Source ticket ID
- Failure details (test name, error, root cause)
- Environment info

## Output

- Jira defect key (e.g., `PROJ-456`)
- Link added to source ticket

## Process

1. **Dedup check**: Search existing defects for same error signature
2. **Create defect** with:
   - Summary: `[AUTO] TICKET-123: Test failure - brief description`
   - Description: Full error, stack trace, environment, reproduction steps
   - Labels: `auto-generated`, `qa-pipeline`, `TICKET-123`
   - Link: `relates to` source ticket
3. **Comment on source ticket**: "Auto-created defect PROJ-456 for failing test"

## Uses

- `JiraApi.ts` → `createDefect()`, `searchIssues()`

## Safety

- Only create if no existing matching defect
- Always label `auto-generated`
- Human triage required within 24h
