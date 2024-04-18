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

async function sleep(secs: number) {
  // console.log(`sleeping for ${secs} seconds`)
  return new Promise(resolve => setTimeout(resolve, secs * 1000))
}

// FIXME: instead of scanning the whole table, we use the lastfetch table
// change the backend to store the last fetch details
// key: address_package (deplyoyer :: package_name), value: (packageId :: package_name)
async function getPackageModules(): Promise<Record<string, string>> {
  let packages: Record<string, string> = {}

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
        const address_package = `${item.address}::${item.package_name}`
        const package_address = `${obj.packageId}::${item.package_name}`
        packages[address_package] = package_address
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
    const done = !result.data.events!['pageInfo'].hasNextPage
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
   * assume our page size is 5
   * on the first run there are 4 events and we fetch 2024-01-01, 2024-01-02, 2024-01-03, 2024-01-04
   * set lastFetch to 2024-01-04
   * two more events occur
   * on the next run, when we go fetch 5 events backwards, we fetch
   * 2024-01-02, 2024-01-03, 2024-01-04, 2024-01-05, 2024-01-06
   * reverse them: 2024-01-06, 2024-01-05, 2024-01-04, 2024-01-03, 2024-01-02
   * the last event in our reversed list is 2024-01-02
   * is lastFetch >= lastEvent?  yes, so we're done fetching events
   * we reverse all the events and filter out events that are <= lastFetch
   * which leaves us with 2024-01-05, 2024-01-06
   */
  if ('data' in result && 'events' in result.data!) {
    const new_token = result.data.events!['pageInfo'].startCursor
    // when we fetch events, we get them in chronological order, oldest to newest
    // reverse it so it's newest to oldest
    const events = (result.data.events!['nodes'] ?? []).reverse()
    const etime = events[events.length - 1].timestamp
    const done = stopTime >= etime

    return [new_token, events, done]
  } else {
    return ['', [], true]
  }
}

async function saveEvents(
  address_package: string,
  package_address: string,
  events: Record<string, any>[],
  new_token: string,
) {
  const ltimestamp = events[events.length - 1].timestamp
  console.log(`saving for ${address_package}, ts ${ltimestamp}, events: ${events.length}`)

  // balance changes
  // sender = 0x0 should show up in mint only
  const balances: Record<string, number> = {}

  let items: TransactWriteItem[] = [
    // update timestamp and new_token in TABLE_LASTFETCH
    {
      Update: {
        TableName: C.LASTFETCH_TABLE,
        Key: {
          address_package: {S: address_package},
        },
        UpdateExpression: 'SET last_timestamp = :ltimestamp',
        ExpressionAttributeValues: {
          ':ltimestamp': {S: ltimestamp},
        },
      },
    },
  ]

  // put events in dynamodb
  // this is more complicated than necessary because when multiple
  // events are fired in the same txb, they all have the same timestamp
  const packageEventsToSave = {}
  const addressEventsToSave = {}
  const allocationEventsToSave = {}

  // transfer events by yyyy, yyyy-mm, yyyy-mm-dd
  // for analytics
  const txVolYear = {}
  const txVolYearMonth = {}
  const txVolYearMonthDay = {}

  for (const event of events) {
    // address_package, event_timestamp
    const key = `${address_package}____${event.timestamp}`
    if (!(key in packageEventsToSave)) {
      packageEventsToSave[key] = []
    }
    if (!(address_package in packageEventsToSave)) {
      allocationEventsToSave[address_package] = []
    }

    // key: address_package, period
    const key_yyyy = `${address_package}____${event.timestamp.slice(0, 4)}`
    const key_yyyymm = `${address_package}____${event.timestamp.slice(0, 7)}`
    const key_yyyymmdd = `${address_package}____${event.timestamp.slice(0, 10)}`

    if (!(key_yyyy in txVolYear)) {
      txVolYear[key_yyyy] = 0
    }
    if (!(key_yyyymm in txVolYearMonth)) {
      txVolYearMonth[key_yyyymm] = 0
    }
    if (!(key_yyyymmdd in txVolYearMonthDay)) {
      txVolYearMonthDay[key_yyyymmdd] = 0
    }

    const item = {
      ticker: '$' + event.sendingModule.name.toUpperCase(),
      event: event.type.repr.split(/::/).pop(),
      sender: '',
      recipient: '',
      amount: 0,
      address_package: address_package,
      package_address: package_address,
    }

    switch (item.event) {
      case 'EventMint':
        item.sender = event.sender.address
        item.recipient = event.json.address
        item.amount = parseInt(event.json.amount, 10)
        balances[item.recipient] = (balances[item.recipient] ?? 0) + item.amount
        if (item.sender == item.recipient) {
          allocationEventsToSave[address_package].push(item)
        }

        txVolYear[key_yyyy] += item.amount
        txVolYearMonth[key_yyyymm] += item.amount
        txVolYearMonthDay[key_yyyymmdd] += item.amount
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

        txVolYear[key_yyyy] += item.amount
        txVolYearMonth[key_yyyymm] += item.amount
        txVolYearMonthDay[key_yyyymmdd] += item.amount
        break
      case 'EventAllocation':
        item.sender = event.json.sender
        item.recipient = event.json.recipient
        item.amount = parseInt(event.json.amount, 10)
        balances[item.sender] = (balances[item.sender] ?? 0) - item.amount
        balances[item.recipient] = (balances[item.recipient] ?? 0) + item.amount
        allocationEventsToSave[address_package].push(item)

        txVolYear[key_yyyy] += item.amount
        txVolYearMonth[key_yyyymm] += item.amount
        txVolYearMonthDay[key_yyyymmdd] += item.amount
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
    console.log(`wrote contract + address event items: ${items.slice(i, i + 100).length}`)
    await sleep(C.DB_WRITE_SLEEP)
  }

  await saveTxVolumes(txVolYear, txVolYearMonth, txVolYearMonthDay)
  await saveAllocations(allocationEventsToSave, ltimestamp)
  await saveBalances(balances, address_package, ltimestamp)
}

async function saveTxVolumes(
  txVolYear: Record<string, number>,
  txVolYearMonth: Record<string, number>,
  txVolYearMonthDay: Record<string, number>,
) {
  let writeItems: TransactWriteItem[] = []

  let items: TransactWriteItem[] = Object.entries(txVolYear)
    .filter(([_, volume]) => volume > 0)
    .map(([pkg_date, volume]) => {
      return {
        Update: {
          TableName: C.TXVOL_YEAR_TABLE,
          Key: {
            address_package: {S: pkg_date.split('____')[0]},
            period: {S: pkg_date.split('____')[1]},
          },
          UpdateExpression: 'ADD volume :volume',
          ExpressionAttributeValues: {
            ':volume': {N: `${volume}`},
          },
        },
      }
    })
  if (items.length > 0) writeItems.push(...items)

  items = Object.entries(txVolYearMonth)
    .filter(([_, volume]) => volume > 0)
    .map(([pkg_date, volume]) => {
      return {
        Update: {
          TableName: C.TXVOL_YEARMONTH_TABLE,
          Key: {
            address_package: {S: pkg_date.split('____')[0]},
            period: {S: pkg_date.split('____')[1]},
          },
          UpdateExpression: 'ADD volume :volume',
          ExpressionAttributeValues: {
            ':volume': {N: `${volume}`},
          },
        },
      }
    })
  if (items.length > 0) writeItems.push(...items)

  items = Object.entries(txVolYearMonthDay)
    .filter(([_, volume]) => volume > 0)
    .map(([pkg_date, volume]) => {
      return {
        Update: {
          TableName: C.TXVOL_YEARMONTHDAY_TABLE,
          Key: {
            address_package: {S: pkg_date.split('____')[0]},
            period: {S: pkg_date.split('____')[1]},
          },
          UpdateExpression: 'ADD volume :volume',
          ExpressionAttributeValues: {
            ':volume': {N: `${volume}`},
          },
        },
      }
    })
  if (items.length > 0) writeItems.push(...items)

  if (writeItems.length == 0) return

  // transactions are limited to 100 objects each
  for (let i = 0; i < writeItems.length; i += 100) {
    const txWriteCommand = new TransactWriteItemsCommand({
      TransactItems: writeItems.slice(i, i + 100),
    })
    await dbclient.send(txWriteCommand)
    console.log(`wrote txvols: ${writeItems.slice(i, i + 100).length}`)
    await sleep(C.DB_WRITE_SLEEP)
  }
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

async function saveBalances(balances: Record<string, number>, address_package: string, ltimestamp: string) {
  const items: TransactWriteItem[] = Object.entries(balances)
    .filter(([_, balance]) => balance > 0)
    .map(([address, balance]) => {
      // console.log(`balance ${address} $${address_package.split('::')[1].toUpperCase()}: ${balance}`)
      return {
        Update: {
          TableName: C.BALANCES_TABLE,
          Key: {
            address: {S: address},
            address_package: {S: address_package},
          },
          UpdateExpression: 'ADD balance :balance SET last_timestamp = :ltimestamp, ticker = :ticker',
          ExpressionAttributeValues: {
            ':balance': {N: `${balance}`},
            ':ltimestamp': {S: ltimestamp},
            ':ticker': {S: `$${address_package.split('::')[1].toUpperCase()}`},
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
  // console.log(JSON.stringify(packages, null, 2))
  console.log(`processing up to ${Object.keys(packages).length} packages`)

  for (const [address_package, package_address] of Object.entries(packages)) {
    let ltime = await lastFetchEventTime(address_package)
    let packageEvents: object[] = []
    let packageDone = false
    const forward = ltime == ''

    let token = ''
    while (!packageDone) {
      let new_token = ''
      let events: object[]
      let done = false
      if (forward) {
        ;[new_token, events, done] = await getTokenEvents(package_address, token)
      } else {
        ;[new_token, events, done] = await getTokenEventsBackwards(package_address, token, ltime)
      }
      packageDone = done
      token = new_token
      if (events.length > 0) {
        packageEvents.push(...events)
        console.log(
          `fetched events for ${address_package}: ${events.length}, new token is ${token} done ${packageDone}`,
        )
        await sleep(C.API_FETCH_SLEEP)
      }

      if (packageDone) {
        if (!forward) {
          packageEvents = packageEvents.reverse()
          packageEvents = packageEvents.filter(event => event['timestamp'] > ltime)
        }
        if (packageEvents.length > 0) {
          await saveEvents(address_package, package_address, packageEvents, new_token)
          await sleep(C.DB_WRITE_SLEEP)
        }
      }
    }
  }
}
