# restful-booker-api

![Playwright API Tests](https://github.com/yatinsinghal07/restful-booker-api/actions/workflows/playwright.yml/badge.svg)
![GitHub Pages](https://img.shields.io/badge/Report-GitHub%20Pages-blue?logo=github)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-24-green?logo=node.js)

A Playwright + TypeScript based API test automation framework for [Restful Booker](https://restful-booker.herokuapp.com), with a fully automated CI/CD pipeline including branch protection, auto PR merge, HTML report publishing, and email notifications.

🔗 **[View Live Test Report](https://yatinsinghal07.github.io/restful-booker-api)**

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev) | API test execution |
| TypeScript | Type-safe test scripting |
| Node.js 24 | Runtime environment |
| GitHub Actions | CI/CD pipeline |
| GitHub Pages | Live HTML report hosting |
| Gmail SMTP | Email notifications |
| GitHub Artifacts | Report backup (7-day retention) |

---

## Project Structure

```
restful-booker-api/
├── .github/
│   └── workflows/
│       ├── playwright.yml          # CI/CD pipeline (test → deploy → notify)
│       └── auto-pr-merge.yml       # Auto PR creation and squash merge
├── tests/
│   ├── Booking.crud.spec.ts        # Full CRUD lifecycle (serial execution)
│   ├── auth.spec.ts                # Auth edge cases
│   ├── booking.spec.ts             # Booking filters and listing
│   └── negative.spec.ts            # Negative and error scenarios
├── utils/
│   ├── authApi.ts                  # Auth API calls
│   ├── authHelper.ts               # Token management
│   ├── bookingApi.ts               # Booking API calls
│   └── responseValidator.ts        # Shared assertion helpers
├── types/
│   ├── authTypes.ts                # Auth TypeScript interfaces
│   └── bookingTypes.ts             # Booking TypeScript interfaces
├── test-data/
│   ├── authData.ts                 # Auth payloads
│   └── bookingData.ts              # Booking payloads
└── playwright.config.ts            # Playwright configuration
```

---

## Test Coverage

| Suite | File | Scenarios |
|-------|------|-----------|
| CRUD | `Booking.crud.spec.ts` | Create → Read → Update (PUT) → Partial Update (PATCH) → Delete → Verify deletion |
| Auth | `auth.spec.ts` | Valid credentials, invalid credentials, missing fields, empty token |
| Filters | `booking.spec.ts` | List all bookings, filter by first name, last name, check-in/check-out date |
| Negative | `negative.spec.ts` | Invalid booking ID, unauthorized update/delete, malformed payloads, wrong HTTP methods |

---

## CI/CD Pipeline

### Feature Branch Flow (PR)

```
feature branch push
        ↓
Auto: merge latest main → conflict-free
        ↓
Auto: PR created + squash merge enabled
        ↓
test ✅ → results ✅
(deploy and notify skipped on PR — correct behavior)
```

### Main Branch Flow (after merge)

```
push to main
        ↓
test ✅ → results ✅ → deploy ✅ → notify-deploy 📧
                    ↘
                  notify-test 📧
```

### Job Summary

| Job | Trigger | Description |
|-----|---------|-------------|
| `test` | PR + push to main | Runs all Playwright tests, uploads report artifact |
| `results` | After `test` | Gate job — fails pipeline if tests failed |
| `deploy` | Push to main only | Publishes HTML report to GitHub Pages |
| `notify-test` | Push to main only | Emails test result with report as ZIP attachment |
| `notify-deploy` | After deploy | Emails live GitHub Pages report URL |

---

## Branch Protection

`main` is protected via GitHub Rulesets:

- Direct pushes to `main` are blocked
- PRs require `results` job to pass before merge
- All merges use squash strategy via auto-merge
- Feature branches are auto-deleted after merge

Setup path:
```
Repository → Settings → Rules → Rulesets → Protect main
→ Require status checks → Add check: results
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
git clone https://github.com/yatinsinghal07/restful-booker-api.git
cd restful-booker-api
npm ci
npx playwright install --with-deps chromium
```

### Run Tests

```bash
# Run all tests
npx playwright test

# Run specific suite
npx playwright test tests/Booking.crud.spec.ts

# Run with UI mode
npx playwright test --ui

# Generate and open HTML report
npx playwright test --reporter=html
npx playwright show-report
```

---

## GitHub Secrets

Add these in: `Repository → Settings → Secrets and variables → Actions`

| Secret | Description |
|--------|-------------|
| `AUTO_MERGE_TOKEN` | GitHub PAT with `repo` + `workflow` scope (for auto PR merge) |
| `GMAIL_ID` | Gmail address used for sending notifications |
| `GMAIL_APP_PASSWORD` | 16-character Google App Password (no spaces) |

> ⚠️ Never commit credentials in code. Always use GitHub Secrets.

### Generating Gmail App Password

```
Google Account → Security → 2-Step Verification → ON
Google Account → Security → App passwords → Create → Copy 16-digit password
```

---

## Test Report

Reports are available in three ways after every main branch push:

1. **GitHub Pages** — Live interactive report: [https://yatinsinghal07.github.io/restful-booker-api](https://yatinsinghal07.github.io/restful-booker-api)
2. **Email attachment** — ZIP of HTML report sent to configured Gmail after tests complete
3. **GitHub Actions Artifact** — Backup available for 7 days in the Actions run

---

## Future Enhancements

- [ ] Smoke and regression test tags (`@smoke`, `@regression`)
- [ ] Environment-based execution (dev / staging / prod)
- [ ] JSON Schema validation for API responses
- [ ] Allure report integration
- [ ] Slack / Teams notification support
- [ ] API coverage dashboard
- [ ] Retry logic for flaky network tests
- [ ] Parallel test execution across multiple workers

---

## Author

**Yatin Singhal**

---

## Project Status

✅ Active — fully automated from commit to report delivery via CI/CD.
