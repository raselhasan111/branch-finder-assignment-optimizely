import { gql } from 'graphql-request';

// Fields needed for display, filtering, and map — no _score (meaningless without ranking)
const BRANCH_CORE_FIELDS = gql`
  fragment BranchCoreFields on Branch {
    _id
    Name
    Street
    City
    Country
    CountryCode
    ZipCode
    Coordinates
    Phone
    Email
  }
`;

// Search queries additionally surface _score for RELEVANCE/SEMANTIC ordering
const BRANCH_SEARCH_FIELDS = gql`
  fragment BranchSearchFields on Branch {
    ...BranchCoreFields
    _score
  }
  ${BRANCH_CORE_FIELDS}
`;

export const SEARCH_BRANCHES = gql`
  ${BRANCH_SEARCH_FIELDS}
  query SearchBranches($query: String!, $limit: Int!, $skip: Int!) {
    Branch(
      where: { _fulltext: { match: $query, fuzzy: true } }
      limit: $limit
      skip: $skip
      orderBy: { _ranking: RELEVANCE }
    ) {
      items {
        ...BranchSearchFields
      }
      total
    }
  }
`;

export const SEMANTIC_SEARCH_BRANCHES = gql`
  ${BRANCH_SEARCH_FIELDS}
  query SemanticSearchBranches($query: String!, $limit: Int!, $skip: Int!) {
    Branch(
      where: { _fulltext: { match: $query } }
      limit: $limit
      skip: $skip
      orderBy: { _ranking: SEMANTIC }
    ) {
      items {
        ...BranchSearchFields
      }
      total
    }
  }
`;

// Single paginated list query — used for both page-by-page display and full-dataset batch fetch
export const LIST_BRANCHES = gql`
  ${BRANCH_CORE_FIELDS}
  query ListBranches($limit: Int!, $skip: Int!) {
    Branch(limit: $limit, skip: $skip) {
      items {
        ...BranchCoreFields
      }
      total
    }
  }
`;
