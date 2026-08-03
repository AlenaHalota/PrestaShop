import { test as base, expect } from '@playwright/test';
import { clearTestState, createTestUser, type TestUser } from './auth';

type FixtureOptions = {
  testUser: TestUser;
};

export const test = base.extend<FixtureOptions>({
  testUser: async ({}, use) => {
    const user = createTestUser();
    await use(user);
  },
  page: async ({ page }, use) => {
    await clearTestState(page);
    await use(page);
    await clearTestState(page);
  },
});

export { expect };
