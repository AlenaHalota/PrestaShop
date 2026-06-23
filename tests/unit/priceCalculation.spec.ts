import { test, expect } from '@playwright/test';
import { calculateTotal } from '../../utils/price';

test('price calculation with taxes and discounts', async () => {
  const items = [
    { price: 10, qty: 2 },
    { price: 5, qty: 1 },
  ];
  const taxRate = 0.2; // 20%
  const discount = 3; // flat discount
  const total = calculateTotal(items, taxRate, discount);
  // manual calculation: (10*2 + 5*1) = 25; tax = 5; subtotal=30; minus discount=27
  expect(total).toBeCloseTo(27);
});
