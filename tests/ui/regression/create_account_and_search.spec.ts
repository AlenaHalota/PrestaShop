import { test } from '@playwright/test';
import { HomePage } from '../../../pages/HomePage';

test.describe('Regression - account and search', () => {
  test.beforeEach(async ({}, testInfo) => {
    testInfo.annotations.push({ type: 'tag', description: 'regression' });
    testInfo.annotations.push({ type: 'tag', description: 'ui' });
  });
  test('search for product', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.search('dress');
  });
});