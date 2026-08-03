import { Page } from '@playwright/test';
import { createEmailAddress } from '../utils/createEmail';

export type TestUser = {
  email: string;
  password: string;
};

export function createTestUser(prefix = 'qa'): TestUser {
  return {
    email: createEmailAddress(prefix),
    password: process.env.TEST_PASSWORD || 'Password123!',
  };
}

export async function clearTestState(page: Page) {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}
