---
name: pull-jira-ticket
description: Extract acceptance criteria from Jira ticket
---

# Pull Jira Ticket Skill

Extract acceptance criteria from a Jira ticket for test generation.

## Required

- `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` in env
- `mcp-atlassian` configured in `.mcp.json`

## Steps

1. **Get ticket** via MCP: `jira.getTicket(PROJ-123)`
2. **Extract AC** from description / acceptance criteria field
3. **Parse** into testable scenarios
4. **Return** structured data for test generation

## Output Format

```json
{
  "ticketKey": "PROJ-123",
  "summary": "User can checkout with valid credit card",
  "acceptanceCriteria": [
    "Given a user with items in cart",
    "When they enter valid credit card details",
    "Then order is confirmed",
    "And confirmation email is sent"
  ],
  "issueType": "Story",
  "labels": ["checkout", "payments"],
  "components": ["web", "payments"]
}
```

## Usage

```
Use skills/pull-jira-ticket to extract AC from PROJ-123
```
