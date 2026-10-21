# Team Contacts & Escalation

## Team

| Role          | Name | Slack | Email | Responsibilities                           |
| ------------- | ---- | ----- | ----- | ------------------------------------------ |
| QA Lead       |      |       |       | Pipeline ownership, flake triage, releases |
| QA Engineer   |      |       |       | Test development, Page Objects, CI         |
| DevOps        |      |       |       | GitHub Actions, runners, secrets rotation  |
| Dev Lead      |      |       |       | `data-test` attributes, deployments        |
| Product Owner |      |       |       | Acceptance criteria, prioritization        |

## Jira

| Item              | Value            |
| ----------------- | ---------------- |
| Project Key       | `PROJ`           |
| QA Component      | `QA Automation`  |
| Defect Label      | `qa-pipeline`    |
| Auto-defect Label | `auto-generated` |
| Epic Link         | `QA Pipeline`    |

## Escalation Paths

| Issue                       | 1st Contact | 2nd Contact | SLA      |
| --------------------------- | ----------- | ----------- | -------- |
| CI pipeline broken          | DevOps      | QA Lead     | 1 hour   |
| Flaky test blocking release | QA Engineer | QA Lead     | 4 hours  |
| Security scan failure       | DevOps      | QA Lead     | 2 hours  |
| Environment down            | DevOps      | Dev Lead    | 30 min   |
| Secret rotation needed      | DevOps      | QA Lead     | 24 hours |

## Token Rotation Schedule

| Token           | Frequency | Owner   | Next Due |
| --------------- | --------- | ------- | -------- |
| GitHub PAT (CI) | 90 days   | DevOps  |          |
| Slack Webhook   | 180 days  | QA Lead |          |
| Jira API Token  | 180 days  | QA Lead |          |
| npm token       | N/A       | N/A     | N/A      |

## Secrets Inventory

| Secret               | Scope            | Rotation   | Owner   |
| -------------------- | ---------------- | ---------- | ------- |
| `TEST_USER_PASSWORD` | App              | Per policy | QA Lead |
| `SLACK_WEBHOOK_URL`  | Notifications    | Per policy | QA Lead |
| `JIRA_API_TOKEN`     | Jira integration | Per policy | QA Lead |
| `JIRA_EMAIL`         | Jira integration | Per policy | QA Lead |
| `JIRA_BASE_URL`      | Jira integration | Per policy | QA Lead |

## On-Call

- Primary: QA Lead
- Secondary: DevOps
- Rotation: Weekly (Mon-Sun)

## Incident Response

1. **Acknowledge** in #qa-alerts (Slack) within 15 min
2. **Assess** impact (CI blocked? Release blocked? Security?)
3. **Mitigate** (revert, disable job, hotfix)
4. **Root Cause** within 24 hours
5. **Postmortem** if customer-facing or > 1 hour downtime
