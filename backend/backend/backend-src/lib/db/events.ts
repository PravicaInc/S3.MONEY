/**
 * @file Functions related to DynamoDB operations for events and balance.
 */

import {DynamoDBClient, QueryCommand} from '@aws-sdk/client-dynamodb'
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb'

import {DB} from '../../constants'
import {tickerToPackageName} from '../utils'

const DB_CLIENT = new DynamoDBClient()

/**
 * Get all events for a package.
 *
 * @param {string} pkgAddress - package address
 * @param {string} ticker - smart contract ticker
 */
export async function getPackageEvents(pkgAddress: string, ticker: string) {
  const addressPackage = `${pkgAddress}::${tickerToPackageName(ticker)}`
  console.log(addressPackage)

  const command = new QueryCommand({
    TableName: DB.CONTRACT_EVENTS_TABLE,
    KeyConditionExpression: 'address_package = :address_package',
    ExpressionAttributeValues: marshall({
      ':address_package': addressPackage,
    }),
    ScanIndexForward: false,
  })

  const response = await DB_CLIENT.send(command)

  if (response.Items === undefined) return []
  else return response.Items?.map(item => unmarshall(item)) ?? []
}

/**
 * Get all events for a wallet address.
 *
 * @param {string} address - wallet address
 */
export async function getAddressEvents(address: string) {
  const command = new QueryCommand({
    TableName: DB.ADDRESS_EVENTS_TABLE,
    KeyConditionExpression: 'address = :address',
    ExpressionAttributeValues: marshall({
      ':address': address,
    }),
    ScanIndexForward: false,
  })

  const response = await DB_CLIENT.send(command)

  if (response.Items === undefined) return []
  else return response.Items?.map(item => unmarshall(item)) ?? []
}

/**
 * Get a wallet address's balances.
 *
 * @param {string} address - wallet address
 */
export async function getBalances(address: string) {
  const command = new QueryCommand({
    TableName: DB.BALANCES_TABLE,
    KeyConditionExpression: 'address = :address',
    ExpressionAttributeValues: marshall({
      ':address': address,
    }),
    ProjectionExpression: 'ticker, balance, last_timestamp',
  })

  const response = await DB_CLIENT.send(command)
  if (response.Items === undefined) return []
  else return response.Items?.map(item => unmarshall(item)) ?? []
}

// eof
