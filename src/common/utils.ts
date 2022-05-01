export const transformPricesToNumber = (price: string): number =>
  +price.replace(/(\d+),(\d+).*/, '$1.$2').replace(/[^0-9.]/g, '');

export const calculateDiscountPercentage = (
  priceDifference: number,
  originalPrice: number,
): number => +((priceDifference / originalPrice) * 100).toFixed(2);

export const isOlderThan24Hours = (lastUpdateDate: string): boolean => {
  const date = new Date(lastUpdateDate);
  return date.getTime() < Date.now() - 86400000;
};
