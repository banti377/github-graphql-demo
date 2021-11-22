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

export const GET_REPOSITORIES = gql`
  query GetRepositories(
    $login: String!
    $first: Int
    $after: String
    $before: String
  ) {
    user(login: $login) {
      repositories(first: $first, after: $after, before: $before) {
        totalCount
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
        nodes {
          ... on Repository {
            name
            stargazerCount
            watchers {
              totalCount
            }
          }
        }
      }
    }
  }
`;

export const GET_ISSUES = gql`
  query GetIssues(
    $name: String
    $owner: String
    $first: Int
    $after: String
    $before: String
  ) {
    repository(name: $name, owner: $owner) {
      issues(first: $first, after: $after, before: $before) {
        totalCount
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
        nodes {
          title
          createdAt
          author {
            login
          }
        }
      }
    }
  }
`;
