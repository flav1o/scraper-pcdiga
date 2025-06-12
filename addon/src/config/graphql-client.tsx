import { ApolloClient, InMemoryCache } from "@apollo/client";

export const GraphqlClientConfig = (authToken: string | null) =>
  new ApolloClient({
    uri: "http://localhost:3000/graphql",
    cache: new InMemoryCache(),
    queryDeduplication: false,
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : "",
    },
  });
