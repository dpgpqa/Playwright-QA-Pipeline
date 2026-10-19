# Team Contacts & Escalation

## QA Team

| Role | Name | Slack | Email | Responsibility |
|------|------|-------|-------|----------------|
| QA Lead | Diego Zaito | @diego.zaito | diego.zaito@company.com | Architecture, CI/CD, escalation |
| QA Engineer | [Name] | @[slack] | [email]@company.com | Test authoring, flake triage |
| SDET | [Name] | @[slack] | [email]@company.com | API, performance, tooling |

## Dev Team Contacts

| Service | Owner | Slack | Email | Jira Component |
|---------|-------|-------|-------|----------------|
| Frontend | [Name] | @[slack] | [email]@company.com | web |
| Backend API | [Name] | @[slack] | [email]@company.com | api |
| Payments | [Name] | @[slack] | [email]@company.com | payments |
| Auth | [Name] | @[slack] | [email]@company.com | auth |

## Jira

| Key | Description |
|-----|-------------|
| `QA` | QA project for auto-defects |
| `PROJ` | Main product project |
| `PAY` | Payments project |

## Escalation Path

1. **Test failure** → QA Engineer (30 min SLA)
2. **Flake / env issue** → QA Lead (1 hr SLA)
3. **Blocking prod regression** → QA Lead + Dev Lead (immediate)
4. **Security finding** → Security team + QA Lead (immediate)

## Token Rotation (90 days)

| Token | Owner | Last Rotated | Next Due |
|-------|-------|--------------|----------|
| `JIRA_API_TOKEN` | Diego Zaito | 2024-01-15 | 2024-04-15 |
| `LHCI_GITHUB_APP_TOKEN` | Diego Zaito | 2024-01-15 | 2024-04-15 |
| `SLACK_WEBHOOK_URL` | Diego Zaito | 2024-01-15 | 2024-04-15 |
| GitHub PAT (CI) | Diego Zaito | 2024-01-15 | 2024-04-15 |

## On-Call

| Week | Primary | Secondary |
|------|---------|-----------|
| 2024-01-15 | Diego Zaito | [Name] |
| 2024-01-22 | [Name] | Diego Zaito |

Update this file after each rotation.
