import { expect, Page } from '@playwright/test';
import { testConfig } from '../config';

export async function searchForGoods(page: Page, query: string) {
  await page.goto('/');

  const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
  if (await searchInput.count() === 0) {
    throw new Error('Search input was not found on the page');
  }

  await expect(searchInput).toBeVisible({ timeout: 5000 });
  await searchInput.fill(query);
  await searchInput.press('Enter');

  const results = page.locator('.product, .product-item, .product-list, .search-results');
  await expect(results.first()).toBeVisible({ timeout: 10000 });
}

export async function addToCart(page: Page, productIndex = 0) {
  await page.goto('/');

  const product = page.locator('article, .product, .product-item, .product-list a, .product-card').nth(productIndex);
  if (await product.count() === 0) {
    throw new Error('No products were found on the page');
  }

  await expect(product).toBeVisible({ timeout: 10000 });
  await product.click();

  const addToCartButton = page.getByRole('button', {
    name: /add to cart|add to basket|buy now|do košíku|přidat do košíku/i,
  }).first();
  await expect(addToCartButton).toBeVisible({ timeout: 10000 });
  await addToCartButton.click();
}

export async function addToFavorites(page: Page, productIndex = 0) {
  await page.goto('/');

  const product = page.locator('article, .product, .product-item, .product-list a, .product-card').nth(productIndex);
  if (await product.count() === 0) {
    throw new Error('No products were found on the page');
  }

  await expect(product).toBeVisible({ timeout: 10000 });
  await product.hover();
  const favoriteButton = page.getByRole('button', { name: /favorite|add to favorites|přidat do oblíbených/i }).first();
  if (await favoriteButton.count() > 0) {
    await favoriteButton.click();
  }
}
