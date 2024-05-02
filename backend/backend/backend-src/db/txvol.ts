/**
 * @file Functions related to DynamoDB operations for transaction volumes.
 */

import {DynamoDBClient, QueryCommand} from '@aws-sdk/client-dynamodb'
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb'
import * as df from 'date-fns'

import {DB} from '../constants'
import {tickerToPackageName} from '../lib/utils'

const DB_CLIENT = new DynamoDBClient()

/**
 * Get all events for a package.
 *
 * @param {string} address - address of package deployer
 * @param {string} ticker - smart contract ticker
 * @param {string} range - '1d', '7d', '1m', '3m', '6m', '1y', etc.
 */
export async function getTxVol(address: string, ticker: string, range: string) {
  const addressPackage = `${address}::${tickerToPackageName(ticker)}`
  range = range.toLowerCase().trim()
  const suffix = range.slice(-1)
  const amount = parseInt(range.slice(0, -1), 10)

  let table: string = ''
  let rangeStart: string = ''
  switch (suffix) {
    case 'd':
      table = DB.TXVOL_YEARMONTHDAY_TABLE
      rangeStart = df.sub(new Date(), {days: amount}).toISOString().slice(0, 10)
      break
    case 'm':
      table = DB.TXVOL_YEARMONTH_TABLE
      rangeStart = df.sub(new Date(), {months: amount}).toISOString().slice(0, 7)
      break
    case 'y':
      table = DB.TXVOL_YEAR_TABLE
      rangeStart = df.sub(new Date(), {years: amount}).toISOString().slice(0, 4)
      break
  }

  const command = new QueryCommand({
    TableName: table,
    KeyConditionExpression: 'address_package = :address_package AND period >= :start',
    ExpressionAttributeValues: marshall({
      ':address_package': addressPackage,
      ':start': rangeStart,
    }),
    ProjectionExpression: 'period, volume',
  })

  const response = await DB_CLIENT.send(command)

  if (response.Items === undefined) return []
  else return response.Items?.map(item => unmarshall(item)) ?? []
}

// eof
