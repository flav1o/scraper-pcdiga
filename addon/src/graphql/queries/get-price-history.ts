import { gql } from "@apollo/client";

export const GET_PRICE_HISTORY = gql`
  query GetPriceHistory($input: GetPriceHistoryInput!) {
    getPriceHistory(input: $input) {
      productId
      history {
        date
        price
        discountPrice
        store
      }
    }
  }
`;
