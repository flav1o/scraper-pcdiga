import { gql } from "@apollo/client";

export const REMOVE_ON_WATCH = gql`
  mutation removeOnWatch($productId: String!) {
    removeOnWatch(productId: $productId) {
      success
      message
    }
  }
`;