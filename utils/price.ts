export function calculateTotal(items: { price: number; qty: number }[], taxRate = 0, discount = 0) {
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const tax = subtotal * taxRate;
  return Math.round((subtotal + tax - discount) * 100) / 100;
}
