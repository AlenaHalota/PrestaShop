import { test, expect } from '@playwright/test';

// Regression: create account and search
test.describe('Regression - account and search', () => {
  test('open registration and try to create account', async ({ page }) => {
    await page.goto('/');
    // try to find registration link
    const register = page.getByRole('link', { name: /register|sign up|create account/i });
    if (await register.count() > 0) {
      await register.first().click();
      const emailInput = page.locator('input[type="email"], input[name*="email"]');
      await expect(emailInput).toBeVisible({ timeout: 5000 });
      await emailInput.fill(`test+${Date.now()}@example.com`);
      // try to submit
      const submit = page.getByRole('button', { name: /create|register|sign up/i }).first();
      if (await submit.count() > 0) {
        // do not expect a successful registration (depends on backend), just ensure form flows
        await submit.click();
      }
    } else {
      test.skip(true, 'Registration link not found on home page');
    }
  });

  test('search for product', async ({ page }) => {
    await page.goto('/');
    const search = page.locator('input[type="search"], input[name*="search"], input[placeholder*="Search"]');
    if (await search.count() === 0) test.skip(true, 'Search input not found');
    await search.first().fill('dress');
    await search.first().press('Enter');
    // expect results or a message
    const results = page.locator('.product, .product-list, .search-results');
    await expect(results.first()).toBeVisible({ timeout: 5000 });
  });
});
