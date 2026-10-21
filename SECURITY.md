# Security

## Threat Model

This pipeline targets **your application** — not the pipeline itself. The pipeline is a build-time tool.

### Assets to Protect

| Asset                               | Protection                          |
| ----------------------------------- | ----------------------------------- |
| Application credentials             | GitHub Secrets (never in code)      |
| Test data (PII)                     | Factories generate synthetic data   |
| CI artifacts (reports, screenshots) | 14-30 day retention, no secrets     |
| Source code                         | CodeQL, gitleaks, dependency review |

### Attack Vectors & Mitigations

| Vector         | Mitigation                                       |
| -------------- | ------------------------------------------------ |
| Secret leakage | gitleaks pre-commit + CI, no `.env.local` in git |
| Supply chain   | npm audit, dependency-review on PR, Dependabot   |
| SAST           | CodeQL on every push/PR                          |
| DAST           | OWASP ZAP baseline scan on every push/PR         |
| Malicious PR   | Required reviews, status checks, CODEOWNERS      |

## Secrets Management

### Required Secrets

| Secret               | Scope            | Rotation   |
| -------------------- | ---------------- | ---------- |
| `TEST_USER_PASSWORD` | App credentials  | Per policy |
| `SLACK_WEBHOOK_URL`  | Notifications    | Per policy |
| `JIRA_API_TOKEN`     | Jira integration | Per policy |

### Never Commit

- `.env.local` (gitignored)
- Any `.auth/` files (gitignored)
- API keys, tokens, passwords in any file

## Reporting Vulnerabilities

**Do not open public issues** for security vulnerabilities.

Email: security@your-domain.com

Include:

- Description of vulnerability
- Steps to reproduce
- Impact assessment
- Suggested fix (if any)

We'll acknowledge within 48 hours and coordinate disclosure.

## Secure Development Practices

1. **Dependencies**: `npm audit` on every CI, Dependabot auto-PRs
2. **Static Analysis**: CodeQL on every push/PR
3. **Secret Scanning**: gitleaks pre-commit + CI
4. **Dependency Review**: Required on every PR
5. **DAST**: OWASP ZAP baseline scan on push/PR
6. **Container**: Not applicable (runs on GitHub-hosted runners)

## CI Security Gates

| Gate              | Workflow     | Blocks Merge                 |
| ----------------- | ------------ | ---------------------------- |
| CodeQL            | security.yml | No (advisory)                |
| gitleaks          | security.yml | Yes (pre-commit)             |
| npm audit         | security.yml | Advisory (dev deps allowed)  |
| Dependency Review | security.yml | Yes (PR only)                |
| OWASP ZAP         | security.yml | Advisory (continue-on-error) |

## Token Rotation

| Token               | Frequency | Owner     |
| ------------------- | --------- | --------- |
| GitHub PAT (CI)     | 90 days   | DevOps    |
| Slack Webhook       | 180 days  | Team lead |
| Jira API Token      | 180 days  | QA lead   |
| npm token (publish) | N/A       | N/A       |

Document rotation in `docs/contacts.md`.
