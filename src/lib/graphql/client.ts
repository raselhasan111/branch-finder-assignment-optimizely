import { GraphQLClient } from 'graphql-request';

const endpoint = import.meta.env.VITE_GRAPH_ENDPOINT;
const authKey = import.meta.env.VITE_GRAPH_AUTH;

if (!endpoint || !authKey) {
  throw new Error(
    'Missing Optimizely Graph configuration. Set VITE_GRAPH_ENDPOINT and VITE_GRAPH_AUTH in .env',
  );
}

export const graphqlClient = new GraphQLClient(`${endpoint}?auth=${authKey}`);
