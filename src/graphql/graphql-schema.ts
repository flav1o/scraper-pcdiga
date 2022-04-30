
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
    currentPrice?: Nullable<number>;
    originalPrice?: Nullable<number>;
    priceDifference?: Nullable<number>;
    isOnDiscount?: Nullable<boolean>;
    discountPercentage?: Nullable<number>;
}

export class Product {
    _id: string;
    ean: string;
    name: string;
    url: string;
    prices?: Nullable<Nullable<ProductPrice>[]>;
}

export class ProductPrice {
    _id: string;
    currentPrice?: Nullable<number>;
    originalPrice?: Nullable<number>;
    priceDifference?: Nullable<number>;
    isOnDiscount?: Nullable<boolean>;
    discountPercentage?: Nullable<number>;
}

export abstract class IQuery {
    abstract getProduct(url?: Nullable<string>, ean?: Nullable<string>): Product | Promise<Product>;
}

type Nullable<T> = T | null;
