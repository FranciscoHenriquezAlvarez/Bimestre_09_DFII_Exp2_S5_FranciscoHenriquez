import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';

// URL de GraphQL compatible con desarrollo y GitHub Pages.
const GRAPHQL_URL = `${import.meta.env.BASE_URL}graphql`;

const client = new ApolloClient({
  link: new HttpLink({
    uri: GRAPHQL_URL,
  }),

  cache: new InMemoryCache(),
});

export default client;