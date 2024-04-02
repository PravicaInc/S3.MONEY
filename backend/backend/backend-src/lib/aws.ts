import fs from 'fs'
import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  QueryCommandInput,
  TransactGetItem,
  TransactGetItemsCommand,
  TransactWriteItem,
  TransactWriteItemsCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb'
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb'
import {DeleteObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'

import slug from 'slug'

import * as IFace from './interfaces'

const BUCKET = 's3m-contracts-dev'
const DEPLOYED_TABLE = 's3m-contracts-dev'
const ROLES_TABLE = 's3m-roles-dev'
const ROLES_INDEX = 's3m-roles-by-address-index-dev'

const ADDRESS_EVENTS_TABLE = 's3m-address-events-dev'
const CONTRACT_EVENTS_TABLE = 's3m-contracts-events-dev'
const BALANCES_TABLE = 's3m-balances-dev'
const LASTFETCH_TABLE = 's3m-contracts-lastfetch-dev'

const RELATED_TABLE = 's3m-related-dev'

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

export function createKeyForZip(address: string, package_name: string) {
  return `packages/${address}/${package_name}.zip`
}

export async function savePackageS3(address: string, package_name: string, zip_path: string) {
  const key = createKeyForZip(address, package_name)
  console.log(`uploading object: ${zip_path} to ${BUCKET} as ${key}`)

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: fs.readFileSync(zip_path), // about 300-400 kbytes
    ContentType: 'application/zip',
  })

  await s3client.send(command)

  return key
}

export async function deletePackageS3(address: string, package_name: string) {
  const key = createKeyForZip(address, package_name)

  if (key !== undefined) {
    console.log(`deleting object: ${key} in ${BUCKET}`)
    const command = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })

    return await s3client.send(command)
  }
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
          package_zip: {S: data.package_zip!},
        },
      },
    },
    {
      Put: {
        // dummy timestamp for the event watcher
        TableName: LASTFETCH_TABLE,
        Item: {
          address_package: {S: `${data.address}::${data.packageName!}`},
          last_timestamp: {S: '2024-01-01T00:00:00.000Z'},
        },
      },
    },
    {
      Put: {
        TableName: ROLES_TABLE,
        Item: {
          address_package: {S: `${data.address}::${data.packageName!}`},
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
          address_package: {S: `${data.address}::${data.packageName!}`},
          package_role: {S: role},
          role_address: {S: address},
        },
      },
    })
  }
  // transactions are limited to 100 objects each
  for (let i = 0; i < items.length; i += 100) {
    const txWriteCommand = new TransactWriteItemsCommand({
      TransactItems: items.slice(i, i + 100),
    })
    await dbclient.send(txWriteCommand)
  }
}

async function getPackageRoles(address: string, package_name: string): Promise<Record<string, any>[]> {
  const command = new QueryCommand({
    TableName: ROLES_TABLE,
    KeyConditionExpression: 'address_package = :address_package',
    ExpressionAttributeValues: {
      ':address_package': {S: `${address}::${package_name}`},
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
            address_package: {S: `${address}::${package_name}`},
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
            address_package: {S: `${address}::${package_name}`},
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

export async function listPackagesDB(address: string, extra: Record<string, string> | undefined, summary: boolean) {
  // first, we need to get all the roles for the address
  const rInput: QueryCommandInput = {
    TableName: ROLES_TABLE,
    IndexName: ROLES_INDEX,
    KeyConditionExpression: 'role_address = :role_address',
    ExpressionAttributeValues: {
      ':role_address': {S: address},
    },
  }

  const command = new QueryCommand(rInput)
  const response = await dbclient.send(command!)
  const retlist = response.Items?.map(item => unmarshall(item))

  if (retlist === undefined || retlist.length == 0) return []

  const pkgRoleMap = {} as Record<string, string[]>
  const packages: string[] = []
  for (const item of retlist) {
    if ('address_package' in item) {
      if (!(item.address_package in pkgRoleMap)) {
        const [address, pkg] = item.address_package.split('::')
        if (extra !== undefined && extra.ticker !== undefined && pkg != extra.ticker) continue
        pkgRoleMap[item.address_package] = []
        packages.push(item.address_package)
      }
      pkgRoleMap[item.address_package].push(item.package_role)
    }
  }

  // now we can get the package data
  let items: TransactGetItem[] = []
  for (const pkg of packages) {
    const [address, package_name] = pkg.split('::')
    items.push({
      Get: {
        TableName: DEPLOYED_TABLE,
        Key: {
          address: {S: address},
          package_name: {S: package_name},
        },
      },
    })
  }

  if (items.length == 0) return []

  const txGetCommand = new TransactGetItemsCommand({
    TransactItems: items,
  })
  const getResponse = await dbclient.send(txGetCommand)

  let pkgItems
  try {
    const responses = getResponse.Responses?.map(response => unmarshall(response.Item!)) ?? []
    pkgItems = responses.sort((x, y) => x['deploy_date'].localeCompare(y['deploy_date'])).reverse()
    if (extra !== undefined && extra.digest !== undefined) {
      pkgItems = responses.filter(item => item.txid == extra.digest)
    }
    if (summary) {
      pkgItems = pkgItems.map(item => {
        const deploy_data = item.deploy_data as IFace.IPackageDeployed
        item.deploy_addresses = IFace.packageSummary(deploy_data?.objectChanges ?? [])
        delete item.deploy_data
        return item
      })
    }
  } catch (e: any) {
    console.log(`should get ${items.length} items from deployed contracts table but failed: ${e.toString()}`)
    return []
  }

  for (let item of pkgItems ?? []) {
    const key = `${item.address}::${item.package_name}`
    item.address_roles = pkgRoleMap[key]
    delete item.address
  }

  return pkgItems || []
}

export async function getBalancesDB(address: string) {
  const command = new QueryCommand({
    TableName: BALANCES_TABLE,
    KeyConditionExpression: 'address = :address',
    ExpressionAttributeValues: {
      ':address': {S: address},
    },
    ProjectionExpression: 'ticker, balance, last_timestamp',
  })

  const response = await dbclient.send(command)
  if (response.Items === undefined) return []
  else return response.Items?.map(item => unmarshall(item)) ?? []
}

export async function getPackageEventsDB(address: string, ticker: string) {
  const module = ticker.toLowerCase().slice(1)
  const address_package = `${address}::${module}`
  const command = new QueryCommand({
    TableName: CONTRACT_EVENTS_TABLE,
    KeyConditionExpression: 'address_package = :address_package',
    ExpressionAttributeValues: {
      ':address_package': {S: address_package},
    },
    ScanIndexForward: false,
  })

  const response = await dbclient.send(command)

  if (response.Items === undefined) return []
  else return response.Items?.map(item => unmarshall(item)) ?? []
}

export async function getAddressEventsDB(address: string) {
  const command = new QueryCommand({
    TableName: ADDRESS_EVENTS_TABLE,
    KeyConditionExpression: 'address = :address',
    ExpressionAttributeValues: {
      ':address': {S: address},
    },
    ScanIndexForward: false,
  })

  const response = await dbclient.send(command)

  if (response.Items === undefined) return []
  else return response.Items?.map(item => unmarshall(item)) ?? []
}

export async function listRelatedDB(pkgaddress: string) {
  const command = new QueryCommand({
    TableName: RELATED_TABLE,
    KeyConditionExpression: 'address = :address',
    ExpressionAttributeValues: {
      ':address': {S: pkgaddress},
    },
    ProjectionExpression: 'slug, label, wallet_address',
  })

  const response = await dbclient.send(command)

  if (response.Items === undefined) return []
  else return response.Items?.map(item => unmarshall(item)) ?? []
}

export async function getRelatedDB(pkgaddress: string, slug: string) {
  const command = new GetItemCommand({
    TableName: RELATED_TABLE,
    Key: {
      address: {S: pkgaddress},
      slug: {S: slug},
    },
  })

  const response = await dbclient.send(command)
  if (response.Item === undefined) return null

  return unmarshall(response.Item)
}

export async function createRelatedDB(address: string, data: IFace.IRelatedCreate) {
  // get existing item, if any
  const label_slug = slug(data.label)
  const existing = await getRelatedDB(address, label_slug)
  if (existing !== null) return {error: `label '${data.label}' already exists for address: ${existing.address}`}

  const command = new PutItemCommand({
    TableName: RELATED_TABLE,
    Item: marshall({
      address: address,
      slug: label_slug,
      label: data.label,
      wallet_address: data.address,
    }),
  })

  return await dbclient.send(command)
}

export async function deleteRelatedDB(address: string, slug: string) {
  // get existing item, if any
  const existing = await getRelatedDB(address, slug)
  if (existing === null) return

  const command = new DeleteItemCommand({
    TableName: RELATED_TABLE,
    Key: {
      address: {S: address},
      slug: {S: slug},
    },
  })

  return await dbclient.send(command)
}

export async function modifyRelatedDB(address: string, existing_slug: string, data: IFace.IRelatedModify) {
  // check if the new label already exists
  const new_slug = slug(data.label)
  const maybe = await getRelatedDB(address, new_slug)
  if (maybe !== null) return {error: `label '${data.label}' already exists for address: ${address}`}

  const existing = await getRelatedDB(address, existing_slug)
  if (existing == null) return {error: `entry '${existing_slug}' does not exist for address: ${address}`}

  let items: TransactWriteItem[] = [
    {
      Delete: {
        TableName: RELATED_TABLE,
        Key: {
          address: {S: address},
          slug: {S: existing_slug},
        },
      },
    },
    {
      Put: {
        TableName: RELATED_TABLE,
        Item: marshall({
          address: address,
          slug: new_slug,
          label: data.label,
          wallet_address: existing.wallet_address,
        }),
      },
    },
  ]

  const txWriteCommand = new TransactWriteItemsCommand({
    TransactItems: items,
  })

  await dbclient.send(txWriteCommand)
}
