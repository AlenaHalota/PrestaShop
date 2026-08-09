import { test, expect } from '../../../fixtures';
import dotenv from 'dotenv';
import path from 'path';
import { HomePage } from '../../../pages/HomePage';
import { addToCart, searchForGoods } from '../../../helpers/catalog';
import { getRandomGoodsItem } from '../../../config/test-data';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

test.describe('Smoke test', () => {
  test.beforeEach(async ({}, testInfo) => {
    testInfo.annotations.push({ type: 'tag', description: 'smoke' });
    testInfo.annotations.push({ type: 'tag', description: 'ui' });
    testInfo.annotations.push({ type: 'tag', description: 'prGate' });
  });
  test.only('login successful', async ({ page, testUser }) => {

    const emailAddress = process.env.EMAIL || testUser.email;
    const password = process.env.PASSWORD || testUser.password;

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
    await addToCart(page, 0);
    await expect(homePage.cartLink.first()).toBeVisible({ timeout: 10000 });
  });

  test('search for product', async ({ page }) => {
    const product = getRandomGoodsItem();
    await searchForGoods(page, product.name);
  });
});
