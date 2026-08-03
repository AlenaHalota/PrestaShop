import path from 'path';
import dotenv from 'dotenv';

const envPath = path.resolve(process.cwd(), '.env');
const localEnvPath = path.resolve(process.cwd(), '.env.local');

dotenv.config({ path: envPath });
dotenv.config({ path: localEnvPath });

const parsedRetries = process.env.PLAYWRIGHT_RETRIES ? Number(process.env.PLAYWRIGHT_RETRIES) : process.env.CI ? 2 : 0;
const parsedWorkers = process.env.PLAYWRIGHT_WORKERS ? Number(process.env.PLAYWRIGHT_WORKERS) : process.env.CI ? 1 : undefined;

export const testConfig = {
  baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://37.27.17.198:8084/cs/',
  defaultTimeout: Number(process.env.PLAYWRIGHT_TIMEOUT || 15000),
  retries: parsedRetries,
  workers: parsedWorkers,
  browsers: ['chromium', 'firefox', 'webkit'] as const,
  defaultLocale: process.env.TEST_LOCALE || 'en',
  testData: {
    emailDomain: process.env.TEST_EMAIL_DOMAIN || 'example.com',
  },
};

export function getPlaywrightRetries() {
  return Number.isFinite(testConfig.retries) ? testConfig.retries : 0;
}

export function getPlaywrightWorkers() {
  return typeof testConfig.workers === 'number' ? testConfig.workers : undefined;
}
