import goods from '../data/goods.json';
import clients from '../data/clients.json';

export function getRandomGoodsItem() {
  const index = Math.floor(Math.random() * goods.length);
  return goods[index];
}

export function getClientByLocale(locale: string) {
  return clients.find((client) => client.locale === locale) || clients[0];
}
