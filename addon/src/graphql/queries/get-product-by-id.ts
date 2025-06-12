import { gql } from "@apollo/client";

export const GET_PRODUCT_BY_ID = gql`
  query product($key: String!) {
    product(key: $key) {
      product {
        productId
        name
        image
        ean
        lastScrapedAt
        url
      }
      prices {
        priceId
        productId
        originalPrice
        discountPrice
        createdAt
        store
      }
    }
  }
`;
