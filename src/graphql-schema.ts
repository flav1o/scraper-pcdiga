
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
    currentPrice: number;
    originalPrice: number;
    priceDifference: number;
    isOnDiscount?: Nullable<boolean>;
    discountPercentage: number;
}

export interface Product {
    _id: string;
    ean: string;
    name: string;
    url: string;
    prices?: Nullable<Nullable<ProductPrice>[]>;
    updatedAt: string;
    createdAt: string;
}

export interface ProductPrice {
    _id: string;
    currentPrice: number;
    originalPrice: number;
    priceDifference: number;
    isOnDiscount?: Nullable<boolean>;
    discountPercentage: number;
    updatedAt: string;
    createdAt: string;
}

export interface IQuery {
    getProduct(url: string): Product | Promise<Product>;
}

type Nullable<T> = T | null;
