import { gql } from "@apollo/client";

export const GET_IS_PRODUCT_ON_WATCH = gql`
    query checkIsOnWatch($productId: String!) {
        checkIsOnWatch(productId: $productId)
    }
`;