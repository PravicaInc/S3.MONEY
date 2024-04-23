/**
 * @file Functions related to DynamoDB operations for holdings over time.
 */

import {DynamoDBClient, QueryCommand, QueryCommandInput} from '@aws-sdk/client-dynamodb'
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb'
import * as df from 'date-fns'

import {DB} from '../../constants'
import {tickerToPackageName} from '../utils'

const DB_CLIENT = new DynamoDBClient()

/**
 * Get all events for a package.
 *
 * @param {string} address - address of package deployer
 * @param {string} ticker - smart contract ticker
 * @param {string} range - '1d', '7d', '1m', '3m', '6m', '1y', etc.
 */
export async function getHoldings(address: string, ticker: string, range: string) {
  const addressPackage = `${address}::${tickerToPackageName(ticker)}`
  range = range.toLowerCase().trim()
  const suffix = range.slice(-1)
  const amount = parseInt(range.slice(0, -1), 10)

  let rangeStart: string = ''
  switch (suffix) {
    case 'd':
      rangeStart = df.sub(new Date(), {days: amount}).toISOString().slice(0, 10)
      break
    case 'm':
      rangeStart = df.sub(new Date(), {months: amount}).toISOString().slice(0, 7) + '-01'
      break
    case 'y':
      rangeStart = df.sub(new Date(), {years: amount}).toISOString().slice(0, 4) + '-01-01'
      break
  }

  const command = new QueryCommand({
    TableName: DB.HOLDINGS_TABLE,
    KeyConditionExpression: 'address_package = :address_package AND #date >= :start',
    ExpressionAttributeNames: {'#date': 'date'},
    ExpressionAttributeValues: marshall({
      ':address_package': addressPackage,
      ':start': rangeStart,
    }),
    ProjectionExpression: '#date, holdings',
  })
  const response = await DB_CLIENT.send(command)

  if (response.Items === undefined) return []
  else
    return (
      response.Items?.map(item => {
        let {date, holdings} = unmarshall(item)
        holdings.date = date
        return holdings
      }) ?? []
    )
}

// eof
