import { test, expect } from '@playwright/test';
import goods from '../../data/goods.json';
import clients from '../../data/clients.json';

test('catalog and client fixtures are available for smoke and regression suites', async ({}, testInfo) => {
  testInfo.annotations.push({ type: 'tag', description: 'integration' });
  testInfo.annotations.push({ type: 'tag', description: 'smoke' });
  expect(goods.length).toBeGreaterThan(0);
  expect(clients.length).toBeGreaterThan(0);
  expect(goods[0]).toHaveProperty('sku');
  expect(clients[0]).toHaveProperty('email');
});
