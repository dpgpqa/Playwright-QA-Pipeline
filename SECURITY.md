# Security

## Reporting Vulnerabilities

**Do not open public issues for security vulnerabilities.**

Email: security@your-domain.com (replace with your contact)

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We aim to respond within 48 hours and patch within 7 days for critical issues.

## Secret Handling

### Local Development

- `.env.local` for secrets (gitignored)
- Never commit `.env.local` or any file with secrets
- Use `dotenv` to load — no hardcoded values

### CI/CD (GitHub Actions)

- Store secrets in **Settings → Secrets → Actions**
- Reference as `${{ secrets.SECRET_NAME }}` in workflows
- Never log secrets — GitHub masks them automatically

### Required Secrets

| Secret                     | Description              |
| -------------------------- | ------------------------ |
| `SAUCEDEMO_USERNAME`       | Test account username    |
| `SAUCEDEMO_PASSWORD`       | Test account password    |
| `RESTFUL_BOOKER_BASE_URL`  | API base URL             |
| `THE_INTERNET_BASE_URL`    | App base URL             |
| `JSONPLACEHOLDER_BASE_URL` | API base URL             |
| `DEMOQA_BASE_URL`          | App base URL             |
| `SLACK_WEBHOOK_URL`        | (Optional) Alert webhook |
| `LHCI_GITHUB_APP_TOKEN`    | (Optional) Lighthouse CI |

## Threat Model

### Assets

- Test credentials (low privilege, demo accounts)
- Test data (synthetic, no PII)
- CI/CD pipeline integrity
- Artifact reports (screenshots, traces)

### Threats

| Threat                          | Likelihood | Impact | Mitigation                             |
| ------------------------------- | ---------- | ------ | -------------------------------------- |
| Secret leakage in repo          | Low        | High   | gitleaks + pre-commit + .gitignore     |
| Malicious dependency            | Medium     | High   | CodeQL + dependency-review + npm audit |
| CI injection                    | Low        | High   | Branch protection + required reviews   |
| Flaky test masking real failure | Medium     | Medium | Quarantine process + flake handling    |
| Visual baseline drift           | Medium     | Low    | Per-browser baselines + review         |

### Boundaries

- **Test code** → Runs in isolated browsers, no access to host
- **CI runners** → Ephemeral, no persistent state
- **Artifacts** → Stored in GitHub (7-30 day retention)
- **Secrets** → Never leave GitHub Secrets vault

## Security Gates in CI

### Every PR

- `gitleaks` — Secret scanning
- `CodeQL` — Static analysis (JS/TS)
- `dependency-review` — Vulnerable dependencies
- `npm audit` — High/critical only

### Weekly (Monday 2 AM)

- Full `CodeQL` scan
- `gitleaks` full history scan
- `npm audit` all levels
- OWASP ZAP baseline scan

### On Release

- All above + Lighthouse CI performance audit

## Dependency Policy

- **Direct deps only** — no transitive pinning
- **Weekly Dependabot PRs** — grouped by ecosystem
- **Auto-merge** for patch/minor with passing tests
- **Manual review** for major versions
- **Audit** before adding new deps: `npm audit --omit=dev`

## OWASP ZAP Configuration

Baseline scan targets demo sites (known issues excluded in `.zap/rules.tsv`).

For your app:

1. Remove exclusions in `.zap/rules.tsv`
2. Add authentication script if needed
3. Configure spider/context in `zaproxy/action-baseline`

## Lighthouse CI Budgets

Defined in `lighthouserc.yml`:

| Category       | Threshold | Action |
| -------------- | --------- | ------ |
| Performance    | ≥ 0.5     | Error  |
| Accessibility  | ≥ 0.9     | Error  |
| Best Practices | ≥ 0.8     | Error  |
| SEO            | ≥ 0.7     | Warn   |

Adjust for your app's requirements.

## Incident Response

1. **Detect** — CI failure, security alert, or report
2. **Assess** — Severity (Critical/High/Medium/Low)
3. **Contain** — Revoke secrets, disable workflow, block merge
4. **Remediate** — Patch, rotate, update
5. **Verify** — Re-run security gates
6. **Document** — Post-mortem in `docs/incidents/`

## Compliance

This template supports:

- **SOC 2** — Audit trails via GitHub Actions logs
- **ISO 27001** — Secret management, access control
- **GDPR** — No PII in test data, synthetic only

## Contact

Security team: security@your-domain.com
