# Workspace Instructions

- Always follow the rules and guidelines specified in `testing-strategy.md`.
- When asked to use `playwright-cli`, always open it in headed mode.
- Use `cmd` instead of PowerShell for terminal commands.
- Prefer concise, professional responses and keep implementation suggestions aligned with the existing testing strategy.
- Always consider that pages may be in Czech or English language versions.

## Playwright Testing Standards

- **Strict Pre-conditions:** Never use `test.info().annotations.push()` or silent returns (`return;`) when essential environment variables or credentials (like `EMAIL` or `PASSWORD`) are missing.
- **Error Handling:** If an essential configuration or environment variable is missing, always immediately throw a hard error to fail the test early.
  
  **Bad:**
  if (!EMAIL) { test.info().annotations.push(...); return; }

  **Good:**
  if (!EMAIL) { throw new Error('EMAIL environment variable is required but not set.'); }
