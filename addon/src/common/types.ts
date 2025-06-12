import { Companies } from "@/general.types";

export type Product = {
  productId: string;
  name: string;
  image: string;
  ean: string;
  url: string;
  lastScrapedAt: Date;
  createdAt: Date;
};

export type ProductPrice = {
  priceId: string;
  productId: string;
  originalPrice: number;
  discountPrice?: number;
  store: Companies;
  createdAt: Date;
};

export type LiteProduct = {
  image: string;
  productId: string;
};

export type ProductWithPrices = {
  product: Product;
  prices: ProductPrice[];
};
