# Playwright Test Automation Project

This repository contains the end-to-end (UI), API, and unit tests for the Presta shop project using Playwright.

---

## 🛠 Prerequisites & Setup

* **Node.js**: Ensure you have Node.js (v20 or higher) installed.
* **Dependencies**: Install the project dependencies with `npm install`.
* **Browsers**: Install the Playwright browsers with `npx playwright install`.
* **Environment files**: Create a `.env` file for shared values and a `.env.local` file for local/secret overrides. Both files are loaded automatically by Playwright.
* **Base URL**: The default base URL is `http://37.27.17.198:8084/cs/` if no environment variable is provided.
* **npm scripts**: Test commands are defined in `package.json`.

### Environment variables

The project uses the following variables:

- `PLAYWRIGHT_BASE_URL` – base URL used by all tests. Default: `http://37.27.17.198:8084/cs/`
- `PLAYWRIGHT_RETRIES` – number of retries for failed tests. Default: `0` locally, `2` in CI
- `PLAYWRIGHT_WORKERS` – number of parallel workers. Default: `1` in CI, Playwright default locally
- `EMAIL` – email used by the UI smoke-test login flow
- `PASSWORD` – password used by the UI smoke-test login flow

Example `.env` file:

```env
PLAYWRIGHT_BASE_URL=http://37.27.17.198:8084/cs/
PLAYWRIGHT_RETRIES=0
PLAYWRIGHT_WORKERS=1
EMAIL=your@email.com
PASSWORD=your-password
```

Use `.env.local` for machine-specific values such as local URLs or secrets. The smoke tests require valid `EMAIL` and `PASSWORD` values to run the login scenario.

Notes:
- Tests are added under `tests/api/..`, `tests/ui/..`, `tests/unit/...`.
- Playwright artifacts (traces, screenshots, videos) configuration is in `playwright.config.ts`.

# Installation

```bash
npm install
npx playwright install
```

# Run tests

```bash
npm run test:smoke
npm run test:regression
```

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