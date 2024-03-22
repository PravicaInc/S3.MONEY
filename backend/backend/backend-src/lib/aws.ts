import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  TransactWriteItem,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb'
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb'
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'

import * as IFace from './interfaces'

const BUCKET = 's3.money-contracts-dev'
const DEPLOYED_TABLE = 's3money-deployed-contracts-dev'
const ROLES_TABLE = 's3money-contract-roles-dev'
const ROLES_INDEX = 's3money-contract-roles-dev-roles-index'

const s3client = new S3Client()
const dbclient = new DynamoDBClient()

export async function createPresignedUrlForIcon(key: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ACL: 'public-read',
  })
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
  const deploy_data = marshall(data.data ?? {})
  const package_roles = marshall(data.packageRoles ?? {})
  let icon_url = ''
  if (data.icon_url !== undefined && data.icon_url != 'option::none()') {
    icon_url = data.icon_url
  }

  let items: TransactWriteItem[] = [
    {
      Put: {
        TableName: DEPLOYED_TABLE,
        Item: {
          address: {S: data.address},
          package_name: {S: data.packageName!},
          ticker_name: {S: data.ticker_name!},
          ticker: {S: data.ticker},
          icon_url: {S: icon_url},
          txid: {S: data.txid || ''},
          deploy_date: {S: new Date().toISOString()},
          deploy_data: {M: deploy_data},
          deploy_status: {S: status},
          package_roles: {M: package_roles},
        },
      },
    },
    {
      Put: {
        TableName: ROLES_TABLE,
        Item: {
          address_package: {S: `${data.address}-${data.packageName!}`},
          package_role: {S: 'deployer'},
          role_address: {S: data.address},
        },
      },
    },
  ]

  for (const role of Object.keys(data.packageRoles ?? {}) as IFace.PackageRoles[]) {
    const address = data.packageRoles![role] || data.address
    items.push({
      Put: {
        TableName: ROLES_TABLE,
        Item: {
          address_package: {S: `${data.address}-${data.packageName!}`},
          package_role: {S: role},
          role_address: {S: address},
        },
      },
    })
  }

  const txWriteCommand = new TransactWriteItemsCommand({
    TransactItems: items,
  })

  await dbclient.send(txWriteCommand)
}

async function getPackageRoles(address: string, package_name: string): Promise<Record<string, any>[]> {
  const command = new QueryCommand({
    TableName: ROLES_TABLE,
    KeyConditionExpression: 'address_package = :address_package',
    ExpressionAttributeValues: {
      ':address_package': {S: `${address}-${package_name}`},
    },
    ProjectionExpression: 'package_role',
  })

  const response = await dbclient.send(command!)
  const retlist = response.Items?.map(item => unmarshall(item))

  return retlist ?? []
}

export async function deleteRolesDB(address: string, package_name: string) {
  let items: TransactWriteItem[] = []

  for (const item of await getPackageRoles(address, package_name)) {
    if ('package_role' in item) {
      items.push({
        Delete: {
          TableName: ROLES_TABLE,
          Key: {
            address_package: {S: `${address}-${package_name}`},
            package_role: {S: item.package_role},
          },
        },
      })
    }
  }

  if (items.length == 0) return

  const txWriteCommand = new TransactWriteItemsCommand({
    TransactItems: items,
  })

  return await dbclient.send(txWriteCommand)
}

export async function deletePackageDB(address: string, package_name: string) {
  let items: TransactWriteItem[] = [
    {
      Delete: {
        TableName: DEPLOYED_TABLE,
        Key: {
          address: {S: address},
          package_name: {S: package_name},
        },
      },
    },
  ]

  for (const item of await getPackageRoles(address, package_name)) {
    if ('package_role' in item) {
      items.push({
        Delete: {
          TableName: ROLES_TABLE,
          Key: {
            address_package: {S: `${address}-${package_name}`},
            package_role: {S: item.package_role},
          },
        },
      })
    }
  }

  const txWriteCommand = new TransactWriteItemsCommand({
    TransactItems: items,
  })

  return await dbclient.send(txWriteCommand)
}

export async function listPackagesDB(address: string, summary: boolean) {
  const input: QueryCommandInput = {
    TableName: DEPLOYED_TABLE,
    KeyConditionExpression: 'address = :address',
    ExpressionAttributeValues: {
      ':address': {S: address},
    },
  }
  // let projection = 'package_name, ticker, txid, icon_url, ticker_name, deploy_status, deploy_date, deploy_data'
  if (summary) {
    input.ProjectionExpression = 'package_name, ticker, txid, icon_url, ticker_name, deploy_status, deploy_date'
  } else {
    input.Select = 'ALL_ATTRIBUTES'
  }

  const command = new QueryCommand(input)
  const response = await dbclient.send(command!)
  const retlist = response.Items?.map(item => unmarshall(item))
    .sort((x, y) => x['deploy_date'].localeCompare(y['deploy_date']))
    .reverse()

  return retlist || []
}
