import { gql } from "@apollo/client";

export const ADD_ON_WATCH = gql`
    mutation addOnWatch($input: AddOnWatch!) {
        addOnWatch(input: $input) {
            success
            message
        }
    }
`;