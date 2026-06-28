import { test } from '@playwright/test';
import { HomePage } from '../../../pages/HomePage';

test.describe('Regression - account and search', () => {
  test('search for product', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.search('dress');
  });
});