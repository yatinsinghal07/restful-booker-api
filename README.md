# Playwright API Automation Framework

![Playwright API Tests](https://github.com/yatinsinghal07/restful-booker-api/actions/workflows/playwright.yml/badge.svg)

## Project Overview

This project is a Playwright TypeScript based API automation framework created for testing REST APIs using the Restful Booker API.

The framework validates API endpoints such as authentication, booking creation, booking retrieval, booking update, partial update, and booking deletion. It also includes CI/CD integration using GitHub Actions.

## Tech Stack

| Tool / Technology | Purpose                |
| ----------------- | ---------------------- |
| Playwright        | API automation testing |
| TypeScript        | Test scripting         |
| Node.js           | Runtime environment    |
| GitHub Actions    | CI/CD pipeline         |
| GitHub Pages      | Publish HTML report    |
| Gmail SMTP        | Email notification     |
| HTML Report       | Test execution report  |
| GitHub Artifacts  | Backup of test report  |

## Features

* API automation using Playwright
* TypeScript based test framework
* Common response validation utility
* Test data management
* HTML test report generation
* GitHub Actions CI/CD pipeline
* Artifact backup for Playwright HTML report
* GitHub Pages deployment for test report
* Email notification after main branch merge
* Report ZIP attachment in email
* Branch protection support using result check

## Project Structure

```text
restful-booker-api/
│
├── tests/
│   ├── auth.spec.ts
│   └── booking.spec.ts
│
├── test-data/
│   ├── authData.ts
│   └── bookingData.ts
│
├── utils/
│   ├── responseValidator.ts
│   └── bookingApi.ts
│
├── playwright.config.ts
├── package.json
├── package-lock.json
├── README.md
└── .github/
    └── workflows/
        └── playwright.yml
```

## Test Coverage

| Module              | Test Scenario                                    | Status  |
| ------------------- | ------------------------------------------------ | ------- |
| Auth API            | Validate token generation with valid credentials | Covered |
| Auth API            | Validate login with invalid credentials          | Covered |
| Booking API         | Create booking                                   | Covered |
| Booking API         | Get booking details                              | Covered |
| Booking API         | Update booking                                   | Covered |
| Booking API         | Partial update booking                           | Covered |
| Booking API         | Delete booking                                   | Covered |
| Response Validation | Validate status code and response headers        | Covered |

## CI/CD Workflow

The GitHub Actions workflow is designed to run automated API tests and generate reports.

### Pull Request / Feature Branch Flow

```text
test → results
```

For pull request branches:

* Playwright API tests are executed
* HTML report is generated
* Report is uploaded as GitHub Actions artifact
* Email notification is not sent
* GitHub Pages deployment is not triggered

### Main Branch Flow

```text
test → results → deploy
        ↓          ↓
   notify-test  notify-deploy
```

After merge to main:

* Playwright API tests are executed
* HTML report is generated
* Report is uploaded as artifact backup
* Report is attached in email as ZIP file
* Report is deployed to GitHub Pages
* Deployment email is sent with live report URL

## How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/yatinsinghal07/restful-booker-api.git
cd restful-booker-api
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Install Playwright browser dependencies

```bash
npx playwright install --with-deps chromium
```

### 4. Run tests

```bash
npx playwright test
```

### 5. Run tests with HTML report

```bash
npx playwright test --reporter=html
```

### 6. Open HTML report

```bash
npx playwright show-report
```

## GitHub Secrets Required

The workflow uses Gmail SMTP for email notifications. Add the following secrets in GitHub repository settings:

```text
GMAIL_ID
GMAIL_APP_PASSWORD
```

Path:

```text
Repository → Settings → Secrets and variables → Actions → New repository secret
```

Important:

* `GMAIL_ID` should contain only the Gmail address
* `GMAIL_APP_PASSWORD` should contain the 16-character Google App Password without spaces
* Do not commit Gmail password or app password in code

## Report

The Playwright HTML report is available in two ways:

1. GitHub Actions artifact backup
2. Email attachment after merge to main
3. GitHub Pages live report after successful deployment

## Branch Protection

The branch protection rule should use the `results` job as the required check.

Recommended setup:

```text
Settings → Branches → Branch protection rule → main
```

Enable:

```text
Require status checks to pass before merging
```

Required check:

```text
results
```

## Future Enhancements

* Add more API modules
* Add smoke and regression tags
* Add environment based execution
* Add negative test scenarios
* Add request and response schema validation
* Add Allure report integration
* Add Slack or Teams notification
* Add test summary in email body
* Add API coverage dashboard

## Author

Yatin Singhal

## Project Status

Active and ready for API automation execution through CI/CD.
