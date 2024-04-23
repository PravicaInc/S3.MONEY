import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  TransactWriteItem,
  TransactWriteItemsCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb'

import * as df from 'date-fns'

import * as C from './constants'
import {sleep} from './process'

const dbclient = new DynamoDBClient()

// FIXME: instead of scanning the whole table, we use the lastfetch table
// change the backend to store the last fetch details
// key: address_package (deplyoyer :: package_name), value: (packageId :: package_name)
export async function getPackageModules(): Promise<Record<string, string>> {
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

// FIXME: could be better
export function toHoldings(items: Record<string, any>[]) {
  const holdings: Record<string, any> = {}
  for (const bucket of Object.keys(C.HOLDINGS_BUCKETS)) {
    holdings[bucket] = 0
  }
  for (const item of items) {
    const address = item.address
    const balance = item.balance
    const bucket = Object.keys(C.HOLDINGS_BUCKETS).find(bucket => {
      const [min, max] = C.HOLDINGS_BUCKETS[bucket]
      return balance > min && balance <= max
    })
    if (bucket !== undefined) {
      holdings[bucket] += 1
    }
  }
  return holdings
}

export async function getCumulativeBalances(address_package: string): Promise<TransactWriteItem | undefined> {
  const yesterday = df.subDays(new Date(), 1).toISOString().slice(0, 10)
  const command = new QueryCommand({
    TableName: C.BALANCES_TABLE,
    IndexName: C.BALANCES_BY_ADDRESS_PACKAGE_INDEX,
    KeyConditionExpression: 'address_package = :address_package',
    ExpressionAttributeValues: marshall({
      ':address_package': address_package,
    }),
    ProjectionExpression: 'address, balance',
  })
  const result = await dbclient.send(command)
  const items = result.Items?.map(item => unmarshall(item)) ?? []

  if (items.length === 0) {
    return undefined
  }

  const obj = {
    address_package,
    date: yesterday,
    holdings: toHoldings(items),
  }

  return {
    Put: {
      TableName: C.HOLDINGS_TABLE,
      Item: marshall(obj),
    },
  }
}

export async function storeHoldings() {
  const packages = await getPackageModules()
  console.log(`processing up to ${Object.keys(packages).length} packages`)

  for (const address_package of Object.keys(packages)) {
    let items: TransactWriteItem[] = []
    const cumulative = await getCumulativeBalances(address_package)

    if (cumulative !== undefined) {
      items.push(cumulative)
    }

    for (let i = 0; i < items.length; i += 100) {
      const txWriteCommand = new TransactWriteItemsCommand({
        TransactItems: items.slice(i, i + 100),
      })
      await dbclient.send(txWriteCommand)
      console.log(`wrote holdings items: ${items.slice(i, i + 100).length}`)
      await sleep(C.DB_WRITE_SLEEP)
    }
  }
}

// eof
