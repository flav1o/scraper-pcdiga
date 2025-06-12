import { gql } from "@apollo/client";

export const GET_PRICE_OPPORTUNITY = gql`
    query evaluatePriceOpportunity($productId: String!) {
        evaluatePriceOpportunity(productId: $productId) {
            productId
            classification
            currentPrice
            currentOriginalPrice
            currentDiscountPrice
            hasCurrentDiscount
            averagePrice
            minPrice
            maxPrice
            totalPriceRecords
        }
    }
`;  