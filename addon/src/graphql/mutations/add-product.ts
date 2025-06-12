import { gql } from "@apollo/client";

export const ADD_PRODUCT_RAW = `
      mutation AddProduct($input: CreateProductInput!) {
        product(input: $input) {
          productId
          name  
          ean
          image
          lastScrapedAt
        }
      }
    `;

export const ADD_PRODUCT = gql`
  mutation AddProduct($input: CreateProductInput!) {
    product(input: $input) {
      productId
      name
      ean
      image
      lastScrapedAt
    }
  }
`;
