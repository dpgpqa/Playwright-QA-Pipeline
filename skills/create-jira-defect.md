---
name: create-jira-defect
description: Create deduplicated Jira defect from test failure
---

# Create Jira Defect Skill

Create a `[AUTO]` Jira defect from a test failure with deduplication check.

## Required

- `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_PROJECT_KEY`
- `mcp-atlassian` configured in `.mcp.json`

## Deduplication Check

Before creating, search for existing open defects:

```typescript
const existing = await jira.searchIssues(
  `project = ${JIRA_PROJECT_KEY} AND status in (Open, "In Progress") AND summary ~ "${summary}"`
);
if (existing.issues.length > 0) {
  // Link to existing defect instead of creating new
  return existing.issues[0].key;
}
```

## Defect Template

```json
{
  "fields": {
    "project": { "key": "QA" },
    "summary": "[AUTO] Checkout fails with invalid card on staging",
    "description": {
      "type": "doc",
      "version": 1,
      "content": [
        { "type": "paragraph", "content": [{ "type": "text", "text": "Automated test failure from QA run." }] },
        { "type": "paragraph", "content": [{ "type": "text", "text": "Ticket: PROJ-123" }] },
        { "type": "paragraph", "content": [{ "type": "text", "text": "Test: Checkout with invalid card (@regression)" }] },
        { "type": "paragraph", "content": [{ "type": "text", "text": "Error: TimeoutError: locator.fill: Timeout 15000ms exceeded." }] },
        { "type": "paragraph", "content": [{ "type": "text", "text": "Trace: test-results/regression-checkout-invalid-card/trace.zip" }] },
        { "type": "paragraph", "content": [{ "type": "text", "text": "Environment: staging (https://staging.example.com)" }] },
        { "type": "paragraph", "content": [{ "type": "text", "text": "Commit: abc1234" }] },
        { "type": "paragraph", "content": [{ "type": "text", "text": "Run report: reports/runs/2024-01-15-PROJ-123.md" }] }
      ]
    },
    "issuetype": { "name": "Bug" },
    "labels": ["auto", "qa", "regression", "checkout"],
    "components": [{ "name": "payments" }],
    "assignee": { "accountId": "qa-bot" }
  }
}
```

## Link to Source Ticket

After creation, link to the source feature ticket:

```typescript
await jira.linkIssues(newDefectKey, 'PROJ-123', 'Blocks');
```

## Steps

1. **Search** for existing similar defects
2. **If found** — link to it, return existing key
3. **If not found** — create `[AUTO]` defect with full context
4. **Link** to source feature ticket
5. **Return** new defect key
