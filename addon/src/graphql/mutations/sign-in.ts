import { gql } from "@apollo/client";

export const SIGN_IN = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      authToken
    }
  }
`;
