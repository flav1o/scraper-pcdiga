import { gql } from "@apollo/client";

export const PRODUCT_DETAILS_MOUNT = gql`
  query getProductDetailsMount($productId: String!) {
    product: product(key: $productId) {
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
    checkIsOnWatch(productId: $productId)
  }
`;
