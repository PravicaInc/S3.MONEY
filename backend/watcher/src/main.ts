import {DynamoDBClient, ScanCommand} from '@aws-sdk/client-dynamodb'
import {unmarshall} from '@aws-sdk/util-dynamodb'

import {ExecutionResult} from 'graphql'
import {createClient, RequestParams} from 'graphql-http'

const TESTNET_ENDPOINT = 'https://sui-testnet.mystenlabs.com/graphql'
const DEPLOYED_TABLE = 's3m-contracts-dev'
const TABLE_LASTFETCH = 's3m-contracts-lastfetch-dev'

// docs: https://docs.sui.io/references/sui-api/sui-graphql/reference/queries/events
const queryFirst = `
query($module: String!, $evType: String!) {
  events(
    first: 25
    filter: {
      emittingModule: $module
      eventType: $evType
    }
  ) {
    pageInfo { hasNextPage, endCursor }
    nodes {
      type { repr }
      timestamp
      json
    }
  }
}`

const querySubsequent = `
query($module: String!, $evType: String!, $after: String!) {
  events(
    first: 25
    after: $after
    filter: {
      emittingModule: $module
      eventType: $evType
    }
  ) {
    pageInfo { hasNextPage, endCursor }
    nodes {
      type { repr }
      timestamp
      json
    }
  }
}`

const gclient = createClient({
  url: TESTNET_ENDPOINT,
  fetchFn: fetch,
})
const dbclient = new DynamoDBClient()

function packageSummary(objectChanges) {
  for (const obj of objectChanges) {
    if (obj.type === 'published') {
      return obj.packageId
    }
  }
  return '' // shouldn't happen
}

// FIXME: instead of scanning the whole table, we use the lastfetch table
// change the backend to store the last fetch details
async function getPackageModules(): Promise<string[]> {
  const modules: string[] = []

  const command = new ScanCommand({
    TableName: DEPLOYED_TABLE,
    FilterExpression: 'deploy_status = :status',
    ExpressionAttributeValues: {
      ':status': {S: 'published'},
    },
  })

  const result = await dbclient.send(command)
  const packages = result.Items?.map(item => unmarshall(item)) ?? []

  packages.forEach(item => {
    const deploy_data = item.deploy_data
    for (const obj of deploy_data?.objectChanges ?? []) {
      if (obj.type === 'published') {
        modules.push(`${obj.packageId}::${item.package_name}`)
        break
      }
    }
  })

  return modules
}

async function lastFetch(packageId: string): Promise<string> {
  // for now, we just return ''
  // should be: pagination token from TABLE_LASTFETCH
  return ''
}

async function saveEvents(mod: string, events: object[], timestamp: string, new_token: string) {
  // put timestamp and new_token in TABLE_LASTFETCH
  // put events somewhere
}

async function getTokenEvents(module: string, token: string): Promise<[string, string, object[], boolean]> {
  console.log(`fetching ${module}`)

  let cancel = () => {}
  const result: ExecutionResult<Record<string, unknown>, unknown> = await new Promise((resolve, reject) => {
    let result
    if (token === '') {
      cancel = gclient.subscribe(
        {
          query: queryFirst,
          variables: {module: module, evType: module},
        },
        {
          next: data => (result = data),
          error: reject,
          complete: () => resolve(result),
        },
      )
    } else {
      cancel = gclient.subscribe(
        {
          query: querySubsequent,
          variables: {module: module, evType: module, after: token},
        },
        {
          next: data => (result = data),
          error: reject,
          complete: () => resolve(result),
        },
      )
    }
  })

  if ('data' in result && 'events' in result.data!) {
    const events = result.data.events!['nodes'] ?? []
    const new_token = result.data.events!['pageInfo'].endCursor
    const timestamp = events[events.length - 1].timestamp
    const done = !result.data.events!['pageInfo'].hasNextPage ?? true
    return [timestamp, new_token, events, done]
  } else {
    return ['', '', [], true]
  }
}

void (async () => {
  const modules = await getPackageModules()
  console.log(JSON.stringify(modules, null, 2))

  for (const mod of modules) {
    let token = await lastFetch(mod)
    let moduleEvents: object[] = []
    let moduleDone = false

    while (!moduleDone) {
      let [timestamp, new_token, events, done] = await getTokenEvents(mod, token)
      moduleEvents.push(...events)
      console.log(`fetched events for ${mod}: ${events.length}`)
      moduleDone = done
      token = new_token
      if (moduleDone) {
        await saveEvents(mod, moduleEvents, timestamp, new_token)
      }
    }
  }
})()
