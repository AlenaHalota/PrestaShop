import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { HomePage } from '../../pages/HomePage';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

test.describe('Smoke test', () => {
  test('application is available', async ({ page }) => {
    const resp = await page.request.get('/');
    expect(resp.status()).toBe(200);
  });
});
