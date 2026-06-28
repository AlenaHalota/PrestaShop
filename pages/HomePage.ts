import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly signInLink: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly signOutLink: Locator;
  readonly productEntry: Locator;
  readonly addToCartButton: Locator;
  readonly cartLink: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInLink = page.getByRole('link', { name: /sign in|přihlásit se/i }).first();
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: /sign in|přihlásit se/i });
    this.signOutLink = page.getByRole('link', { name: /sign out|odhlásit/i }).first();

    this.productEntry = page.locator('article, .product, .product-item, .product-list a, .product-card').first();
    this.addToCartButton = page.getByRole('button', {
      name: /add to cart|add to basket|buy now|do košíku|přidat do košíku/i,
    });
    this.cartLink = page.getByRole('link', { name: /Cart|Košík/i }).first();

    this.searchInput = page.locator(
      'input[placeholder="Search our catalog"]',
    );
  }

  async goto() {
    await this.page.goto('/');
  }

  async signIn(email: string, password: string) {
    await this.goto();
    await this.signInLink.click();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
    await expect(this.signOutLink).toBeVisible();
  }

  async addFirstProductToCart() {
    await this.goto();
    if (await this.productEntry.count() === 0) return false;
    await expect(this.productEntry).toBeVisible({ timeout: 10000 });
    await this.productEntry.click();

    if (await this.addToCartButton.count() === 0) return false;
    await expect(this.addToCartButton.first()).toBeVisible({ timeout: 10000 });
    await this.addToCartButton.first().click();
    await expect(this.cartLink).toBeVisible({ timeout: 10000 });
    return true;
  }

  async search(query: string) {
    await this.goto();
    if (await this.searchInput.count() === 0) return false;
    await expect(this.searchInput.first()).toBeVisible({ timeout: 5000 });
    await this.searchInput.first().fill(query);
    await this.searchInput.first().press('Enter');
    const results = this.page.locator('.product, .product-item, .product-list, .search-results');
    await expect(results.first()).toBeVisible({ timeout: 10000 });
    return true;
  }
}