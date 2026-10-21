---
name: pull-jira-ticket
description: Extract acceptance criteria from a Jira ticket
---

# Pull Jira Ticket Skill

Atomic capability: fetch ticket and parse AC.

## Input

- Jira ticket ID (e.g., `PROJ-123`)

## Output

- Structured AC: `Given/When/Then` or scenario list
- Ticket metadata (summary, description, labels)

## Uses

- `JiraApi.ts` → `getTicket(id)`

## Parsing

- Look for `Acceptance Criteria` section
- Convert to testable scenarios
- Identify `@smoke` vs `@regression` paths
