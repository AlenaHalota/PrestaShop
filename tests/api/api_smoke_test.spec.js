import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { HomePage } from '../../pages/HomePage';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

test.describe('Smoke test', () => {
  test.beforeEach(async ({}, testInfo) => {
    testInfo.annotations.push({ type: 'tag', description: 'smoke' });
    testInfo.annotations.push({ type: 'tag', description: 'api' });
    testInfo.annotations.push({ type: 'tag', description: 'prGate' });
  });
  test('application is available', async ({ page }) => {
    const resp = await page.request.get('/');
    expect(resp.status()).toBe(200);
  });
});
