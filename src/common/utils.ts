export const transformPricesToNumber = (price: string): number =>
  +price.replace(/(\d+),(\d+).*/, '$1.$2').replace(/[^0-9.]/g, '');

export const calculateDiscountPercentage = (
  priceDifference: number,
  originalPrice: number,
): number => +((priceDifference / originalPrice) * 100).toFixed(2);

export const isOlderThan24Hours = (lastUpdateDate: Date): boolean => {
  return lastUpdateDate.getTime() < Date.now() - 86400000;
};

export const isCurrentMonthAndYear = (lastUpdateDate: Date): boolean => {
  if (!lastUpdateDate) return false;

  return (
    lastUpdateDate.getMonth() === new Date().getMonth() &&
    lastUpdateDate.getFullYear() === new Date().getFullYear()
  );
};
