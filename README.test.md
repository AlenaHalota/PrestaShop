This repository contains Playwright tests.

Environment:
- Default base URL is set to http://37.27.17.198:8084/cs/ via `playwright.config.ts`.
- You can override the base URL with the environment variable `PLAYWRIGHT_BASE_URL`.

Useful npm scripts:
- npm run test           # runs all Playwright tests
- npm run test:smoke     # runs smoke tests (chromium)
- npm run test:regression# runs regression tests (chromium)
- npm run test:unit      # runs unit tests folder via Playwright (single worker)

Notes:
- Tests are added under `tests/ui/smoke`, `tests/ui/regression`, and `tests/unit`.
- Playwright artifacts (traces, screenshots, videos) configuration is in `playwright.config.ts`.
- Update `package.json` if you want to add linting or a dedicated unit test runner like Jest.
