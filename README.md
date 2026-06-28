# Playwright Test Automation Project

This repository contains the end-to-end (UI), API, and unit tests for the Presta shop project using Playwright.

---

## 🛠 Prerequisites & Setup

* **Node.js**: Ensure you have Node.js (v20 or higher) installed.
* **Environment Variables**: `.env` for variables that can be shared and `env.local` for secrets that must not be part of the repository are only saved locally
* **base URL**: The default base URL is set to http://37.27.17.198:8084/cs/ via playwright.config.ts.
* **npm scripts**: scripts to run the tests are set up in package.json

Notes:
- Tests are added under `tests/api/..`, `tests/ui/..`, `tests/unit/...`.
- Playwright artifacts (traces, screenshots, videos) configuration is in `playwright.config.ts`.

# Installation
npm init playwright@latest

# playwright-cli
npm install -g @playwright/cli

# project structure

├── tests/
│   ├── api/        # API-level contract and integration tests
│   ├── ui/         # End-to-end user interface tests
│   └── unit/       # Isolation/unit tests
├── pages/          # Page Object Models (POM) for UI tests
├── playwright.config.ts  # Global Playwright configuration
└── package.json

# Reports

Playwright is configured to save screenshots, videos, and traces on failure.

Viewing the HTML Report
After a test run completes, you can view the local HTML report:

npx playwright show-report

Debugging with Trace Viewer
If a test fails in CI, download the trace.zip artifact and open it locally:

Bash
npx playwright show-trace path/to/trace.zip

# CI/CD pipeline
Smoke test runs on every PR.
Regression test runs on every merge to master and scheduled nightly.