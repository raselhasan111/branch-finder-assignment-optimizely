import { gql } from 'graphql-request';

const BRANCH_FIELDS = `
  _id
  _score
  Name
  Street
  City
  Country
  CountryCode
  ZipCode
  Coordinates
  Phone
  Email
`;

export const SEARCH_BRANCHES = gql`
  query SearchBranches($query: String!, $limit: Int!, $skip: Int!) {
    Branch(
      where: { _fulltext: { match: $query, fuzzy: true } }
      limit: $limit
      skip: $skip
      orderBy: { _ranking: RELEVANCE }
    ) {
      items {
        ${BRANCH_FIELDS}
      }
      total
    }
  }
`;

export const SEMANTIC_SEARCH_BRANCHES = gql`
  query SemanticSearchBranches($query: String!, $limit: Int!, $skip: Int!) {
    Branch(
      where: { _fulltext: { match: $query } }
      limit: $limit
      skip: $skip
      orderBy: { _ranking: SEMANTIC }
    ) {
      items {
        ${BRANCH_FIELDS}
      }
      total
    }
  }
`;

export const LIST_BRANCHES = gql`
  query ListBranches($limit: Int!, $skip: Int!) {
    Branch(limit: $limit, skip: $skip) {
      items {
        ${BRANCH_FIELDS}
      }
      total
    }
  }
`;

export const LIST_ALL_BRANCHES = gql`
  query ListAllBranches($limit: Int!, $skip: Int!) {
    Branch(limit: $limit, skip: $skip) {
      items {
        ${BRANCH_FIELDS}
      }
      total
    }
  }
`;
