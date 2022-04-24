
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface CreateProductInput {
    ean: string;
    name: string;
    url: string;
}

export interface UpdateProductInput {
    name?: Nullable<string>;
    url?: Nullable<string>;
}

export interface CreateProductPriceInput {
    currentPrice?: Nullable<number>;
    originalPrice?: Nullable<number>;
    priceDifference?: Nullable<number>;
    isOnDiscount?: Nullable<boolean>;
    discountPercentage?: Nullable<number>;
}

export interface Product {
    _id: string;
    ean: string;
    name: string;
    url: string;
    prices?: Nullable<Nullable<ProductPrice>[]>;
}

export interface ProductPrice {
    _id: string;
    currentPrice?: Nullable<number>;
    originalPrice?: Nullable<number>;
    priceDifference?: Nullable<number>;
    isOnDiscount?: Nullable<boolean>;
    discountPercentage?: Nullable<number>;
}

export interface IQuery {
    getProduct(url?: Nullable<string>, ean?: Nullable<string>): Product | Promise<Product>;
}

type Nullable<T> = T | null;
