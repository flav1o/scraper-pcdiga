import { Nullable } from "../../general.types";

export interface ScrapedData {
  product: Product;
}

interface Product {
  image: string | null;
  name: string;
  ean: string;
  price?: {
    original: Price | Nullable<Price>;
    discount?: Price | Nullable<Price>;
    isOnSale: boolean;
  };
}

export interface Price {
  price: number;
  currency: string;
}
