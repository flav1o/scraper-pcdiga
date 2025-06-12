import { gql } from "@apollo/client";

export const GET_PRODUCTS_ON_WATCH = gql`
         query GetOnWatchProducts {
           myWatchList {
             watchId
             product {
               productId
               name
               image
               ean
               lastScrapedAt
               url
               createdAt
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
         }
       `;
