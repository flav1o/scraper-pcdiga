export enum ENTITIES_KEY {
  PRODUCTS_MODEL = 'products',
  AUTO_SEARCH_MODEL = 'autosearch',
}

export interface ICreatedProductEmitterPayload {
  name: string;
  ean: string;
  url: string;
  prices: IProductPrices;
}

export interface IProductPrices {
  currentPrice: number;
  originalPrice: number;
  priceDifference: number;
  discountPercentage: number;
}
