export const transformPricesToNumber = (price: string) =>
  +price.replace(/(\d+),(\d+).*/, '$1.$2').replace(/[^0-9.]/g, '');
