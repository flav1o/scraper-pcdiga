import { gql } from "@apollo/client";

export const GET_PRODUCTS_LITE = gql`
  query GetProducts($term: String!) {
    productsLite(filters: { term: $term }) {
      productId
      name
      image
    }
  }
`;
