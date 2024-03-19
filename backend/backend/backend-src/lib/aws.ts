import {
  DynamoDBClient,
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
  PutItemInput,
} from '@aws-sdk/client-dynamodb'
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb'
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'

import * as IFace from './interfaces'

const BUCKET = 's3.money-contracts-dev'
const DEPLOYED_TABLE = 's3money-deployed-contracts-dev'

const s3client = new S3Client()
const dbclient = new DynamoDBClient()

export async function createPresignedUrlForIcon(key: string, mimeType: string) {
  const command = new PutObjectCommand({Bucket: BUCKET, Key: key, ContentType: mimeType, ACL: 'public-read'})
  return getSignedUrl(s3client, command, {expiresIn: 3600})
}

export async function getPackageDB(address: string, package_name: string) {
  const command = new GetItemCommand({
    TableName: DEPLOYED_TABLE,
    Key: {
      address: {S: address},
      package_name: {S: package_name},
    },
  })

  const response = await dbclient.send(command)
  if (response.Item === undefined) return null

  return unmarshall(response.Item)
}

export async function savePackageDB(data: IFace.IPackageCreated, status: IFace.PackageStatus) {
  let deploy_data = marshall(data.data ?? {})

  const command = new PutItemCommand({
    TableName: DEPLOYED_TABLE,
    Item: {
      address: {S: data.address},
      package_name: {S: data.packageName!},
      ticker: {S: data.ticker},
      txid: {S: data.txid || ''},
      deploy_date: {S: new Date().toISOString()},
      deploy_data: {M: deploy_data},
      deploy_status: {S: status},
    },
  })

  return await dbclient.send(command)
}

export async function deletePackageDB(address: string, package_name: string) {
  const command = new DeleteItemCommand({
    TableName: DEPLOYED_TABLE,
    Key: {
      address: {S: address},
      package_name: {S: package_name},
    },
  })

  const response = await dbclient.send(command)
}

export async function listPackagesDB(address: string, summary: boolean) {
  let projection = 'package_name, ticker, txid, deploy_status, deploy_date, deploy_data'
  if (summary) {
    projection = 'package_name, ticker, txid, deploy_status, deploy_date'
  }
  const command = new ScanCommand({
    TableName: DEPLOYED_TABLE,
    FilterExpression: 'address = :address',
    ExpressionAttributeValues: {
      ':address': {S: address},
    },
    ProjectionExpression: projection,
  })

  const response = await dbclient.send(command)
  const retlist = response.Items?.map(item => unmarshall(item))

  return retlist || []
}
