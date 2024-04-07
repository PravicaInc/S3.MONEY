import fs from 'fs'

import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  TransactWriteItem,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb'
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb'

import {ExecutionResult} from 'graphql'
import {createClient, RequestParams} from 'graphql-http'

import * as C from './constants'
import * as Q from './queries'

const gclient = createClient({
  url: C.TESTNET_ENDPOINT,
  fetchFn: fetch,
})
const dbclient = new DynamoDBClient()

async function sleep(secs) {
  // console.log(`sleeping for ${secs} seconds`)
  return new Promise(resolve => setTimeout(resolve, secs * 1000))
}

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
  const packages: string[] = []

  const command = new ScanCommand({
    TableName: C.TABLE_DEPLOYED,
    FilterExpression: 'deploy_status = :status',
    ExpressionAttributeValues: {
      ':status': {S: 'published'},
    },
  })

  const result = await dbclient.send(command)
  const items = result.Items?.map(item => unmarshall(item)) ?? []

  items.forEach(item => {
    const deploy_data = item.deploy_data
    for (const obj of deploy_data?.objectChanges ?? []) {
      if (obj.type === 'published') {
        packages.push(`${obj.packageId}::${item.package_name}`)
        break
      }
    }
  })

  return packages
}

async function lastFetchEventTime(pkg: string): Promise<string> {
  const command = new GetItemCommand({
    TableName: C.LASTFETCH_TABLE,
    Key: {
      address_package: {S: pkg},
    },
  })

  const response = await dbclient.send(command)
  if (response.Item === undefined) return ''

  const item = unmarshall(response.Item)

  return item.last_timestamp ?? ''
}

async function getTokenEvents(module: string, token: string): Promise<[string, object[], boolean]> {
  // console.log(`fetching ${module}`)

  let cancel = () => {}
  const result: ExecutionResult<Record<string, unknown>, unknown> = await new Promise((resolve, reject) => {
    let innerResult
    if (token === '') {
      cancel = gclient.subscribe(
        {
          query: Q.queryForward,
          variables: {module: module, evType: module},
        },
        {
          next: data => (innerResult = data),
          error: reject,
          complete: () => resolve(innerResult),
        },
      )
    } else {
      cancel = gclient.subscribe(
        {
          query: Q.queryForwardSubsequent,
          variables: {module: module, evType: module, after: token},
        },
        {
          next: data => (innerResult = data),
          error: reject,
          complete: () => resolve(innerResult),
        },
      )
    }
  })

  if ('errors' in result) {
    console.log(JSON.stringify(result.errors, null, 2))
    return ['', [], true]
  }

  if ('data' in result && 'events' in result.data!) {
    const new_token = result.data.events!['pageInfo'].endCursor
    const events = result.data.events!['nodes'] ?? []
    const done = !result.data.events!['pageInfo'].hasNextPage ?? true
    return [new_token, events, done]
  } else {
    return ['', [], true]
  }
}

async function getTokenEventsBackwards(
  module: string,
  token: string,
  stopTime: string,
): Promise<[string, object[], boolean]> {
  // console.log(`fetching ${module} backwards`)

  let cancel = () => {}
  const result: ExecutionResult<Record<string, unknown>, unknown> = await new Promise((resolve, reject) => {
    let innerResult
    if (token === '') {
      cancel = gclient.subscribe(
        {
          query: Q.queryReverse,
          variables: {module: module, evType: module},
        },
        {
          next: data => (innerResult = data),
          error: reject,
          complete: () => resolve(innerResult),
        },
      )
    } else {
      cancel = gclient.subscribe(
        {
          query: Q.queryReverseSubsequent,
          variables: {module: module, evType: module, before: token},
        },
        {
          next: data => (innerResult = data),
          error: reject,
          complete: () => resolve(innerResult),
        },
      )
    }
  })

  if ('errors' in result) {
    console.log(JSON.stringify(result.errors, null, 2))
    return ['', [], true]
  }

  /*
   assume our page size is 5
   on the first run there are 4 events and we fetch 2024-01-01, 2024-01-02, 2024-01-03, 2024-01-04
   set stopTime to 2024-01-04
   two more events occur
   on the next run, when we go fetch 5 events backwards, we fetch
   2024-01-02, 2024-01-03, 2024-01-04, 2024-01-05, 2024-01-06
   reverse them: 2024-01-06, 2024-01-05, 2024-01-04, 2024-01-03, 2024-01-02
   the last event in our reversed list is 2024-01-02
   is stopTime >= lastEvent?  yes, so we're done
   later on, we reverse all the events and filter out events that are <= stopTime
   which leaves us with 2024-01-05, 2024-01-06
   */
  if ('data' in result && 'events' in result.data!) {
    const new_token = result.data.events!['pageInfo'].startCursor
    // when we fetch events, we get them in chronological order, oldest to newest
    // reverse it so it's newest to oldest
    const events = (result.data.events!['nodes'] ?? []).reverse()
    const etime = events[events.length - 1].timestamp
    const done = stopTime >= etime
    // console.log(JSON.stringify(events, null, 2))
    return [new_token, events, done]
  } else {
    return ['', [], true]
  }
}

async function saveEvents(pkg: string, events: Record<string, any>[], new_token: string) {
  const ltimestamp = events[events.length - 1].timestamp
  console.log(`saving for ${pkg}, ts ${ltimestamp}, events: ${events.length}`)
  fs.writeFileSync(`/tmp/${pkg}`, JSON.stringify(events))

  // balance changes
  // sender = 0x0 should show up in mint only
  const balances: Record<string, number> = {}

  let items: TransactWriteItem[] = [
    // update timestamp and new_token in TABLE_LASTFETCH
    {
      Update: {
        TableName: C.LASTFETCH_TABLE,
        Key: {
          address_package: {S: pkg},
        },
        UpdateExpression: 'SET last_timestamp = :ltimestamp',
        ExpressionAttributeValues: {
          ':ltimestamp': {S: ltimestamp},
        },
      },
    },
  ]

  // put events in CONTRACT_EVENTS_TABLE and ADDRESS_EVENTS_TABLE
  // this is more complicated than necessary because when
  // multiple events are fired in the same txb, they all have the same timestamp
  const packageEventsToSave = {}
  const addressEventsToSave = {}
  const allocationEventsToSave = {}

  for (const event of events) {
    // address_package, event_timestamp
    const key = `${pkg}____${event.timestamp}`
    if (!(key in packageEventsToSave)) {
      packageEventsToSave[key] = []
    }
    if (!(pkg in packageEventsToSave)) {
      allocationEventsToSave[pkg] = []
    }

    const item = {
      ticker: '$' + event.sendingModule.name.toUpperCase(),
      event: event.type.repr.split(/::/).pop(),
      sender: '',
      recipient: '',
      amount: 0,
    }

    switch (item.event) {
      case 'EventMint':
        item.sender = event.sender.address
        item.recipient = event.json.address
        item.amount = parseInt(event.json.amount, 10)
        balances[item.recipient] = (balances[item.recipient] ?? 0) + item.amount
        if (item.sender == item.recipient) {
          allocationEventsToSave[pkg].push(item)
        }
        break
      case 'EventBurn':
        item.sender = event.sender.address
        item.amount = parseInt(event.json.amount, 10)
        balances[item.sender] = (balances[item.sender] ?? 0) - item.amount
        break
      case 'EventTransfer':
        // old style mint: EventMint
        // new style mint: EventMint + EventTransfer; skip latter event
        if (event.json.sender == C.ZERO_ADDRESS) {
          continue
        }
        item.sender = event.json.sender
        item.recipient = event.json.recipient
        item.amount = parseInt(event.json.amount, 10)
        balances[item.sender] = (balances[item.sender] ?? 0) - item.amount
        balances[item.recipient] = (balances[item.recipient] ?? 0) + item.amount
        break
      case 'EventAllocation':
        item.sender = event.json.sender
        item.recipient = event.json.recipient
        item.amount = parseInt(event.json.amount, 10)
        balances[item.sender] = (balances[item.sender] ?? 0) - item.amount
        balances[item.recipient] = (balances[item.recipient] ?? 0) + item.amount
        allocationEventsToSave[pkg].push(item)
      case 'EventPaused':
      case 'EventUnpaused':
        item.sender = event.sender.address
        break
      case 'EventTransfersFrozen':
      case 'EventTransfersUnfrozen':
        item.sender = event.sender.address
        break
      default:
        console.log(`unknown event: ${item.event}`)
        item.sender = event.sender.address
    }

    if (item.sender != '') {
      const skey = `${item.sender}____${event.timestamp}`
      if (!(skey in addressEventsToSave)) {
        addressEventsToSave[skey] = [item]
      } else {
        addressEventsToSave[skey].push(item)
      }
    }

    if (item.recipient != '' && item.recipient != item.sender) {
      const rkey = `${item.recipient}____${event.timestamp}`
      if (!(rkey in addressEventsToSave)) {
        addressEventsToSave[rkey] = [item]
      } else {
        addressEventsToSave[rkey].push(item)
      }
    }

    packageEventsToSave[key].push(item)
  }

  for (const [key, pkg_events] of Object.entries(packageEventsToSave)) {
    const [pkg, timestamp] = key.split('____')
    const item = {
      address_package: pkg,
      event_timestamp: timestamp,
      events: pkg_events,
    }

    items.push({
      Put: {
        TableName: C.CONTRACT_EVENTS_TABLE,
        Item: marshall(item, {removeUndefinedValues: true}),
      },
    })
  }

  for (const [key, address_events] of Object.entries(addressEventsToSave)) {
    const [address, timestamp] = key.split('____')
    const item = {
      address: address,
      event_timestamp: timestamp,
      events: address_events,
    }

    items.push({
      Put: {
        TableName: C.ADDRESS_EVENTS_TABLE,
        Item: marshall(item, {removeUndefinedValues: true}),
      },
    })
  }

  for (let i = 0; i < items.length; i += 100) {
    const txWriteCommand = new TransactWriteItemsCommand({
      TransactItems: items.slice(i, i + 100),
    })
    await dbclient.send(txWriteCommand)
    console.log(`wrote items: ${items.slice(i, i + 100).length}`)
    await sleep(C.DB_WRITE_SLEEP)
  }

  await saveAllocations(allocationEventsToSave, ltimestamp)

  // save balances only after everything else has been saved
  await saveBalances(balances, pkg, ltimestamp)
}

async function saveAllocations(allocations: Record<string, object[]>, ltimestamp: string) {
  let items: TransactWriteItem[] = []
  let allocated: Record<string, number> = {}
  let unallocated: Record<string, number> = {}

  for (const [pkg, events] of Object.entries(allocations)) {
    allocated[pkg] = 0
    unallocated[pkg] = 0

    for (const event of events) {
      switch (event['event']) {
        case 'EventAllocation':
          allocated[pkg] += event['amount']
          break
        case 'EventMint':
          unallocated[pkg] += event['amount']
          break
        default: // do nothing
          console.log(`unknown event: ${event['event']}`)
      }
    }
  }

  for (const [pkg, amount] of Object.entries(allocated)) {
    items.push({
      Update: {
        TableName: C.ALLOCATION_TABLE,
        Key: {
          address_package: {S: pkg},
          allocation_type: {S: 'allocated'},
        },
        UpdateExpression: 'ADD amount :amount SET last_timestamp = :ltimestamp',
        ExpressionAttributeValues: {
          ':amount': {N: `${amount}`},
          ':ltimestamp': {S: ltimestamp},
        },
      },
    })
  }

  for (const [pkg, amount] of Object.entries(unallocated)) {
    items.push({
      Update: {
        TableName: C.ALLOCATION_TABLE,
        Key: {
          address_package: {S: pkg},
          allocation_type: {S: 'unallocated'},
        },
        UpdateExpression: 'ADD amount :amount SET last_timestamp = :ltimestamp',
        ExpressionAttributeValues: {
          ':amount': {N: `${amount}`},
          ':ltimestamp': {S: ltimestamp},
        },
      },
    })
  }

  if (items.length == 0) return

  for (let i = 0; i < items.length; i += 100) {
    const txWriteCommand = new TransactWriteItemsCommand({
      TransactItems: items.slice(i, i + 100),
    })
    await dbclient.send(txWriteCommand)
    console.log(`wrote allocations: ${items.slice(i, i + 100).length}`)
    await sleep(C.DB_WRITE_SLEEP)
  }
}

async function saveBalances(balances: Record<string, number>, pkg: string, ltimestamp: string) {
  const items: TransactWriteItem[] = Object.entries(balances).map(([address, balance]) => {
    console.log(`${address}: ${balance} $${pkg.split('::')[1].toUpperCase()}`)
    return {
      Update: {
        TableName: C.BALANCES_TABLE,
        Key: {
          ticker: {S: `$${pkg.split('::')[1].toUpperCase()}`},
          address: {S: address},
        },
        UpdateExpression: 'ADD balance :balance SET last_timestamp = :ltimestamp',
        ExpressionAttributeValues: {
          ':balance': {N: `${balance}`},
          ':ltimestamp': {S: ltimestamp},
        },
      },
    }
  })

  if (items.length == 0) return

  // transactions are limited to 100 objects each
  for (let i = 0; i < items.length; i += 100) {
    const txWriteCommand = new TransactWriteItemsCommand({
      TransactItems: items.slice(i, i + 100),
    })
    await dbclient.send(txWriteCommand)
    console.log(`wrote balances: ${items.slice(i, i + 100).length}`)
    await sleep(C.DB_WRITE_SLEEP)
  }
}

export async function processEvents(_ignore: any) {
  const packages = await getPackageModules()
  console.log(JSON.stringify(packages, null, 2))

  // for (const pkg of ['0xffa422771a3d41c8c2b97570d2ccf916e25aa4c42de21c1167256a377a57393d::play']) {
  // for (const pkg of ['0x06f021fa63f1d47346e3c9c1cb06306b33cc7e6c4e3ae1180000af9599f21a50::mint1']) {
  for (const pkg of packages) {
    let ltime = await lastFetchEventTime(pkg)
    let packageEvents: object[] = []
    let packageDone = false
    const forward = ltime == ''

    let token = ''
    while (!packageDone) {
      await sleep(C.API_FETCH_SLEEP)
      let new_token = ''
      let events: object[]
      let done = false
      if (forward) {
        ;[new_token, events, done] = await getTokenEvents(pkg, token)
      } else {
        ;[new_token, events, done] = await getTokenEventsBackwards(pkg, token, ltime)
      }
      packageEvents.push(...events)
      packageDone = done
      token = new_token
      console.log(`fetched events for ${pkg}: ${events.length}, new token is ${token} done ${packageDone}`)

      if (packageDone) {
        if (!forward) {
          packageEvents = packageEvents.reverse()
          packageEvents = packageEvents.filter(event => event['timestamp'] > ltime)
        }
        if (packageEvents.length > 0) {
          const ltimestamp = packageEvents[packageEvents.length - 1]['timestamp'] ?? 'XXX'
          fs.writeFileSync(`/tmp/${pkg}`, JSON.stringify(packageEvents))

          await saveEvents(pkg, packageEvents, new_token)
          await sleep(C.DB_WRITE_SLEEP)
        }
      }
    }
  }
}
