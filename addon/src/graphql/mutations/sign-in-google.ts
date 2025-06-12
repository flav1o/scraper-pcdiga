import { gql } from "@apollo/client";

export const GOOGLE_AUTH = gql`
  mutation googleAuth($code: String!) {
    googleAuth(code: $code) {
      authToken
    }
  }
`;
