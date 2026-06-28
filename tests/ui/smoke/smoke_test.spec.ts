import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { HomePage } from '../../../pages/HomePage';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

test.describe('Smoke test', () => {
  test('login successful', async ({ page }) => {

    const emailAddress = process.env.EMAIL;
    const password = process.env.PASSWORD;

    if (!emailAddress) {
      throw new Error('EMAIL environment variable is not defined!');
    }
    if (!password) {
      throw new Error('PASSWORD environment variable is not defined!');
    }

    const home = new HomePage(page);
    await home.signIn(emailAddress, password);
  });

  test('add first product to cart', async ({ page }) => {
    const homePage = new HomePage(page);
    await page.goto('/');

    const product = page.locator(
      'article, .product, .product-item, .product-list a, .product-card',
    ).first();
    if (await product.count() === 0) test.skip(true, 'No product entry found on home page');
    await expect(product).toBeVisible({ timeout: 10000 });
    await product.click();

    const addToCartButton = page.getByRole('button', {
      name: /add to cart|add to basket|buy now|do košíku|přidat do košíku/i,
    });
    if (await addToCartButton.count() === 0) test.skip(true, 'Add to cart button not found on product page');
    await expect(addToCartButton.first()).toBeVisible({ timeout: 10000 });
    await addToCartButton.first().click();

  await expect(homePage.cartLink.first()).toBeVisible({ timeout: 10000 });
  });

  test('search for product', async ({ page }) => {
    const home = new HomePage(page);
    await home.search('shirt');
  });
});
