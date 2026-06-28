# Testing Strategy and CI/CD Automation Integration

This document describes the testing strategy, CI/CD integration, and automation guidelines for the project. It covers test types, suites and triggers, reporting, handling flaky tests, data security, framework structure, and basic rules for development and QA teams.

<!-- Changes: clarify PR gate vs unit tests, define PR-smoke vs post-deploy smoke, require sandbox for payment tests, add concrete retry/quarantine policy, standardize test directories. -->

## 1. Strategic decision and testing concept

Automation provides fast feedback to the development team by verifying that a change hasn't broken core functionality. Regression tests cover key user journeys with direct business impact.

The application is suitable for automating repetitive user behaviors such as logging in, searching the catalog, adding favorites, purchasing (with a mocked payment gateway), and similar flows. Prerequisites for automation:

- a dedicated testing mode in the application
- test data and mocked integrations for payment and warehouse/stock

Note: Actual production payments are not automated.

Unit tests run on every commit and in PRs. A critical subset of unit tests (the "PR gate" subset) will run in the PR pipeline and block merge on failure; the full unit-suite runs in CI on commit and scheduled pipelines. This keeps PR feedback fast while ensuring broad coverage in non-blocking CI runs.

We follow the testing pyramid concept with a mix of:

- Unit tests: developer-written tests for individual components.
- API/integration/UI tests: used in smoke and regression suites.
- Exploratory/manual testing: for new features and exploratory checks.

Key metrics to track: critical path coverage, smoke test duration (target <= 10 minutes), regression duration, maintenance time, and number of bugs leaked to production.

## 2. Test suites and CI/CD integration

High-level overview of suites, triggers and significance:

| Test suite | Trigger | Monitored by | Repository / Pipeline | Blocks merge? | Artifacts / notes |
|---|---:|---|---|:---:|---|
| PR check | PR update | Developer | Application repo / PR CI pipeline | Yes | Immediate validation: lint, static analysis, critical unit-test subset (PR gate). Reports & logs. |
| Unit tests | Commit | Developer | Application repo / CI pipeline | No | Fast feedback during development. Reports & logs. |
| Smoke test | Deploy to dev env or PR update (see smoke flavours below) | Developer, QA | QA repo / CI/CD pipeline | No | Fast feedback. Failure artifacts: screenshots, traces. |
| Nightly regression | Sun–Thu 02:00 | QA | QA repo / CI/CD pipeline | No | Edge cases; artifacts: video, screenshot, trace. |
| On-demand regression | Manual | QA | QA repo / CI/CD pipeline | No | Run with tags to test specific features. |
| Full regression | Merge to master (pre-prod) | QA | QA repo / CI/CD pipeline | Yes (blocks release) | Final verification including integration tests for payment and warehouse. |
| Visual regression | On-demand / weekly / pre-release | QA | Application repo / CI/CD pipeline | No | Checks UI appearance; artifacts on failure. |
| Performance testing | On-demand | Developer, QA | Separate repo/pipeline | No | Load and response metrics; graphs and reports. |

## 3. Selected test scenarios

Important scenarios and their priority/level:

| Scenario | Priority | Test level | Frequency / Trigger | Reason |
|---|---:|---|---|---|
| Application is available | 1 | API | Smoke / every PR | Critical availability check |
| Goods updated according to warehouse | 1 | Integration | Smoke / every PR | High business risk |
| Login | 1 | UI | Smoke / every PR | Core functionality |
| Add product to cart | 1 | UI | Smoke / every PR | Critical purchase flow |
| Catalog search | 1 | UI | Smoke / every PR | Frequently used functionality |
| Create new account | 1 | UI | Regression | Critical user flow |
| Cart price calculation | 2 | Unit | Regression | Business logic correctness |
| Change language | 2 | UI | Regression | Frequently used |
| Change currency | 2 | UI | Regression | Frequently used |
| Page navigation | 2 | UI | Regression | Critical for UX |
| Add to favorites | 2 | UI | Regression | Frequently used |
| Filter/sort goods | 2 | UI | Regression | Frequently used |
| Subscribe to newsletter | 2 | UI | Regression | Frequently used |
| Logout | 2 | UI | Regression | Frequently used |

## 4. Reporting strategy and dashboard metrics

### Smoke test reporting

- Availability & notifications: results visible to QA and developers. Failures notify Teams or email after completion.
- Report content: test name, triggering PR, initiating developer, tested environment, and configuration.
- Purpose: quick developer feedback and environment activity tracking.

### Nightly regression reporting

- Monitored by QA; reviewed each morning. Stored in CI for 1 month for retrospective analysis.
- Report content includes failure identification, test logs (stack/line numbers), execution duration, pass rate, worker count, and artifacts such as video/screenshot/trace.

### Full regression reporting

- Same as nightly; additionally notifies Teams or email on completion with pass rate.
- Failure artifacts are preserved for 1 month.

### Dashboard metrics to monitor

- Pipeline execution duration vs test count
- Number of workers vs pipeline length
- Failure frequency & pass-after-retry (to detect flakiness)
- Smoke test duration and test count (to control scope)
- Number of tests in skip/fixme/backlog
- Pass rate for full regression pre-release suites

## 5. Handling flaky tests, performance, and parallelization

### Flaky test management

- Analysis: QA engineers analyze flaky tests and use retries for tracking. Root-cause analysis should be performed for recurrent failures.
- Quarantine: tests failing repeatedly are quarantined for triage and fixing (see quarantine criteria below).
- Conditional execution: retries may be used for PR and daytime pipelines for transient failures but should not mask persistent issues.

Retry and quarantine policy (concrete):

- Retries: allow 1 automatic retry for PR and daytime pipelines (to cover transient network/browser startup issues). Nightly and pre-release (blocking) pipelines must not use automatic retries so failures are not masked.
- Quarantine criteria: a test should be considered for quarantine if it meets either condition: it failed in >= 30% of the last 10 runs, or it failed 3 or more times in the last 7 runs. When quarantined, the test must have an owner, an associated Jira ticket, a documented reason, and an expiry/triage date (e.g., 14 days).
- Skip-in-pipeline guardrails: marking a test as @skipInPipeline is a temporary measure only; every skip must reference the quarantine ticket and an owner, and must be reviewed within the expiry window.

This policy ensures transient problems get short-term mitigation while requiring ownership and remediation for persistent flakiness.

### Performance & parallelization rules

- Parallel execution allowed when tests don't share functionality or data.
- Data isolation: use separate user accounts and dynamically generated data (e.g., helper function for emails).
- Environment cleanup: use test hooks (beforeEach / afterEach) to reset state (cart, users, emails).
- Worker configuration: start with 3 parallel workers, monitor performance and scale as needed.
- Monitor hardware/network: CPU, memory, timeouts, disk I/O, artifact write speed, network latency, browser startup.

## 6. Data security and access management

Test outputs (videos, screenshots, traces, logs) may contain sensitive data (passwords, user data, storageState, cookies).

Measures:

- Access control: restrict CI/artifact access to Development, QA, and Project Manager via the DevOps tool.
- Artifact storage: store detailed artifacts on internal storage and auto-delete from CI after a retention period.
- Credentials: store secrets in a Secret Manager or DevOps library; local credential files must be in .gitignore.
- Test data: generate test data independently of production; never use production data.
- Login state: storageState files must be in .gitignore.

## 7. Test automation framework structure

We recommend a modular Page Object Model structure. Standardized directories (recommended):

```
tests/              # Test scenarios covering business logic
├── unit/           # Unit tests (fast, isolated)
├── ui/             # User Interface tests
│   ├── smoke/      # PR-gate and quick smoke tests
│   └── regression/ # Complex regression suites
├── api/            # API tests
│   ├── smoke/
│   └── regression/
└── integration/    # Integration tests (warehouse, payment, etc.)
pages/              # Page Object modules (components, selectors)
utils/              # Helper functions (email generation, formatting)
helpers/            # Complex application logic helpers
fixtures/           # Environment setup (auth, clearing state)
data/               # Static test data (goods, clients)
config/             # Global config (timeouts, baseUrl, retries)
env/                # Local credentials (gitignored)
```

Mapping examples (aligned with standardized directories):

- `tests/ui/smoke/`: add product to cart, login, search in catalog
- `tests/ui/regression/`: create account, switch language/currency, navigate, favorites, sort, sign out, subscribe newsletter
- `tests/api/smoke/`: application availability
- `tests/unit/`: price calculation in basket
- `tests/integration/`: warehouse/stock update integration, payment gateway integration (sandbox)
- `pages/`: LoginPage, HomePage, CartPage, MainMenu
- `utils/`: createEmailAddress
- `helpers/`: addToFavorites, addToCarts, searchForGoods
- `fixtures/`: auth, clearCookies, checkoutPage, notifications
- `data/`: goods.json, clients.json, cs.json, en.json

Configuration, data and credentials

- Static data: JSON files under `data/` (no sensitive production data).
- Dynamic data: generate emails at runtime with `createEmailAddress`.
- Tests use programmatic login where possible.
- Dedicated test environment separate from developer environments.
- Global settings (baseUrl, timeouts, retry, browsers) live in the central `config` file.

## 8. Rules for development and QA teams

### Naming conventions

- Test files: snake_case and end with `.spec.ts` (e.g. `add_product_to_cart.spec.ts`).
- Page object files: camelCase with `.page.ts` or `.component.ts`.
- Classes: PascalCase.
- Selectors: prefer `data-testid` attributes added during development.
- Shared actions: create reusable helpers for repetitive flows.

### Ownership and process

- Test ownership rotates among team members every sprint based on functionality.
- Integrate automated tests with Jira and the selected DevOps platform for pipelines.

---

If you'd like, I can also:

- convert any of the tables into CSV or a checklist
- produce a summary one-page checklist for quick onboarding
- add a sample `playwright.config.ts` snippet that matches these conventions

Completed formatting and saved the file.
