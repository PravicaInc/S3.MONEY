// docs: https://docs.sui.io/references/sui-api/sui-graphql/reference/queries/events
export const queryForward = `
query($module: String!, $evType: String!) {
  events(
    first: 10
    filter: { emittingModule: $module, eventType: $evType }
  ) {
    pageInfo { hasNextPage, endCursor }
    nodes {
      type { repr }
      timestamp
      sendingModule {
        name
        package { address }
      }
      sender { address }
      json
    }
  }
}
`;

export const queryForwardSubsequent = `
query($module: String!, $evType: String!, $after: String!) {
  events(
    first: 10
    after: $after
    filter: { emittingModule: $module, eventType: $evType }
  ) {
    pageInfo { hasNextPage, endCursor }
    nodes {
      type { repr }
      timestamp
      sendingModule {
        name
        package { address }
      }
      sender { address }
      json
    }
  }
}
`;

export const queryReverse = `
query($module: String!, $evType: String!) {
  events(
    last: 10
    filter: { emittingModule: $module, eventType: $evType }
  ) {
    pageInfo { hasNextPage, endCursor, startCursor }
    nodes {
      type { repr }
      timestamp
      sendingModule {
        name
        package { address }
      }
      sender { address }
      json
    }
  }
}
`;

export const queryReverseSubsequent = `
query($module: String!, $evType: String!, $before: String!) {
  events(
    last: 10
    before: $before
    filter: { emittingModule: $module, eventType: $evType }
  ) {
    pageInfo { hasNextPage, endCursor, startCursor }
    nodes {
      type { repr }
      timestamp
      sendingModule {
        name
        package { address }
      }
      sender { address }
      json
    }
  }
}
`;
