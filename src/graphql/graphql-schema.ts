
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class CreateProductInput {
    ean: string;
    name: string;
    url: string;
}

export class UpdateProductInput {
    name?: Nullable<string>;
    url?: Nullable<string>;
}

export class CreateProductPriceInput {
    currentPrice: number;
    originalPrice: number;
    priceDifference: number;
    isOnDiscount?: Nullable<boolean>;
    discountPercentage: number;
}

export class Product {
    _id: string;
    ean: string;
    name: string;
    url: string;
    prices?: Nullable<Nullable<ProductPrice>[]>;
    updatedAt: string;
    createdAt: string;
}

export class ProductPrice {
    _id: string;
    currentPrice: number;
    originalPrice: number;
    priceDifference: number;
    isOnDiscount?: Nullable<boolean>;
    discountPercentage: number;
    updatedAt: string;
    createdAt: string;
}

export abstract class IQuery {
    abstract getProduct(url: string): Product | Promise<Product>;
}

type Nullable<T> = T | null;
