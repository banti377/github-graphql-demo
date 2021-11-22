import gql from "graphql-tag";

export const SEARCH_USER = gql`
  query SearchUser(
    $query: String!
    $type: SearchType!
    $first: Int
    $after: String
    $before: String
  ) {
    search(
      query: $query
      type: $type
      first: $first
      after: $after
      before: $before
    ) {
      userCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          ... on User {
            email
            avatarUrl
            name
            login
          }
        }
      }
    }
  }
`;
