export function createEmailAddress(prefix = 'test') {
  return `${prefix}+${Date.now()}@example.com`;
}
