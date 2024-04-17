/**
 * @file Functions related to DynamoDB operations for packages.
 */

import {
  AttributeValue,
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  TransactGetItem,
  TransactGetItemsCommand,
  TransactWriteItem,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb'
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb'

import {DB} from '../../constants'
import {IPackageCreated, IPackageDeployed, PackageFilter, PackageStatus, packageSummary} from '../interfaces'

const DB_CLIENT = new DynamoDBClient()

/**
 * Get a package by address and package name.
 *
 * @param {string} address - wallet address of the package creator
 * @param {string} packageName - name of the package
 * @returns {Promise<IPackageDeployed | null>} - package data
 */
export async function getPackage(address: string, packageName: string) {
  const command = new GetItemCommand({
    TableName: DB.DEPLOYED_TABLE,
    Key: marshall({
      address: address,
      package_name: packageName,
    }),
  })

  const response = await DB_CLIENT.send(command)
  if (response.Item === undefined) return null

  return unmarshall(response.Item)
}

/**
 * Get a list of packages that the `address' might have access to.
 *
 * First, search the roles table for packages that the address has a
 * role in, then get the package data from the deployed packages table.
 *
 * @param {string} address - wallet address of the caller
 * @param {IFace.PackageFilter | undefined} filter - optionally filter by ticker or digest (txid)
 * @param {boolean} summary - if true, parse the package's deployment data to get a summary of objects
 * @returns list of packages
 */
export async function getPackages(address: string, filter: PackageFilter | undefined, summary: boolean) {
  // find all roles for the address
  const command = new QueryCommand({
    TableName: DB.ROLES_TABLE,
    IndexName: DB.ROLES_INDEX,
    KeyConditionExpression: 'role_address = :role_address',
    ExpressionAttributeValues: marshall({
      ':role_address': address,
    }),
    ProjectionExpression: 'address_package, package_role',
  })

  const response = await DB_CLIENT.send(command)
  if (response.Items === undefined || response.Items.length === 0) return []
  const retlist = response.Items.map(item => unmarshall(item))

  // map role to wallet address
  const pkgRoleMap: Record<string, string[]> = {}

  for (const item of retlist) {
    if ('address_package' in item) {
      const [address, pkg] = item.address_package.split('::')
      if (filter !== undefined && filter.packageName !== '' && pkg !== filter.packageName) continue

      if (!(item.address_package in pkgRoleMap)) {
        pkgRoleMap[item.address_package] = []
      }
      pkgRoleMap[item.address_package].push(item.package_role)
    }
  }

  if (Object.keys(pkgRoleMap).length === 0) return []

  // now we can get the package data
  let items: TransactGetItem[] = []
  for (const pkg of Object.keys(pkgRoleMap)) {
    const [address, package_name] = pkg.split('::')
    items.push({
      Get: {
        TableName: DB.DEPLOYED_TABLE,
        Key: marshall({
          address: address,
          package_name: package_name,
        }),
      },
    })
  }

  const txGetCommand = new TransactGetItemsCommand({
    TransactItems: items,
  })
  const txResponse = await DB_CLIENT.send(txGetCommand)
  if (txResponse.Responses === undefined || txResponse.Responses.length === 0) return []

  const responses = txResponse.Responses.filter(resp => resp.Item !== undefined).map(resp =>
    unmarshall(resp.Item as Record<string, AttributeValue>),
  )

  let pkgItems = responses
    .sort((x, y) => y['deploy_date'].localeCompare(x['deploy_date'])) // reverse sort
    .map(item => {
      const key = `${item.address}::${item.package_name}`
      item.address_roles = pkgRoleMap[key]
      delete item.address

      return item
    })

  // we've already filtered for the packageName from the roles table
  if (filter !== undefined && filter.digest !== '') {
    pkgItems = pkgItems.filter(item => item.txid === filter.digest)
  }

  if (summary) {
    pkgItems = pkgItems.map(item => {
      const deploy_data: IPackageDeployed = item.deploy_data
      item.deploy_addresses = packageSummary(deploy_data.objectChanges ?? [])
      delete item.deploy_data

      return item
    })
  }

  return pkgItems
}

/**
 * Save package data to DynamoDB.
 *
 * This is called when a package is created, and again when it is published
 * to the blockchain.
 *
 * @param {IPackageCreated} data - deployment data for a package from the tx
 * @param {string} status - either 'created' or 'published'
 */
export async function savePackage(data: IPackageCreated, status: PackageStatus) {
  const deployData = data.data ?? {}
  const packageRoles = data.packageRoles ?? {}
  const addressPackage = `${data.address}::${data.packageName}`
  let iconUrl = ''
  if (data.icon_url !== undefined && data.icon_url !== 'option::none()') {
    iconUrl = data.icon_url
  }

  let items: TransactWriteItem[] = [
    {
      Put: {
        TableName: DB.DEPLOYED_TABLE,
        Item: marshall({
          address: data.address,
          package_name: data.packageName,
          ticker_name: data.ticker_name,
          ticker: data.ticker,
          decimals: data.decimals,
          initialSupply: data.initialSupply,
          maxSupply: data.maxSupply,
          icon_url: iconUrl,
          txid: data.txid || '',
          deploy_date: new Date().toISOString(),
          deploy_data: deployData,
          deploy_status: status,
          package_roles: packageRoles,
          package_zip: data.package_zip,
        }),
      },
    },
    {
      Put: {
        // dummy timestamp for the event watcher
        TableName: DB.LASTFETCH_TABLE,
        Item: marshall({
          address_package: addressPackage,
          last_timestamp: '2024-01-01T00:00:00.000Z',
        }),
      },
    },
    {
      Put: {
        TableName: DB.ROLES_TABLE,
        Item: marshall({
          address_package: addressPackage,
          package_role: 'deployer',
          role_address: data.address,
        }),
      },
    },
  ]

  if (packageRoles !== undefined) {
    for (const [role, address] of Object.entries(packageRoles)) {
      items.push({
        Put: {
          TableName: DB.ROLES_TABLE,
          Item: marshall({
            address_package: addressPackage,
            package_role: role,
            role_address: address || data.address,
          }),
        },
      })
    }
  }

  // transactions are limited to 100 objects each
  for (let i = 0; i < items.length; i += 100) {
    const txWriteCommand = new TransactWriteItemsCommand({
      TransactItems: items.slice(i, i + 100),
    })
    await DB_CLIENT.send(txWriteCommand)
  }
}

/**
 * In the event that the user cancels the deployment, we need to remove the
 * package data from the database.
 *
 * @param {string} address - wallet address of the package creator
 * @param {string} packageName - name of the package
 */
export async function deletePackage(address: string, packageName: string) {
  let items: TransactWriteItem[] = [
    {
      Delete: {
        TableName: DB.DEPLOYED_TABLE,
        Key: marshall({
          address: address,
          package_name: packageName,
        }),
      },
    },
  ]

  for (const role of await getRoles(address, packageName)) {
    items.push({
      Delete: {
        TableName: DB.ROLES_TABLE,
        Key: marshall({
          address_package: `${address}::${packageName}`,
          package_role: role,
        }),
      },
    })
  }

  const txWriteCommand = new TransactWriteItemsCommand({
    TransactItems: items,
  })

  return await DB_CLIENT.send(txWriteCommand)
}

/**
 * Fetch roles related to a package.
 *
 * @param {string} address - wallet address of the package creator
 * @param {strign} packageName - name of the package
 * @returns {Promise<string[]>} - a list of roles
 */
async function getRoles(address: string, packageName: string): Promise<string[]> {
  const command = new QueryCommand({
    TableName: DB.ROLES_TABLE,
    KeyConditionExpression: 'address_package = :address_package',
    ExpressionAttributeValues: marshall({
      ':address_package': `${address}::${packageName}`,
    }),
    ProjectionExpression: 'package_role',
  })

  const response = await DB_CLIENT.send(command!)

  return response.Items?.map(item => unmarshall(item).package_role) ?? []
}

/**
 * Delete roles related to a package.
 *
 * @param {string} address - wallet address of the package creator
 * @param {string} packageName - name of the package
 */
export async function deleteRoles(address: string, packageName: string) {
  let items: TransactWriteItem[] = []

  for (const role of await getRoles(address, packageName)) {
    items.push({
      Delete: {
        TableName: DB.ROLES_TABLE,
        Key: marshall({
          address_package: `${address}::${packageName}`,
          package_role: role,
        }),
      },
    })
  }

  if (items.length === 0) return

  const txWriteCommand = new TransactWriteItemsCommand({
    TransactItems: items,
  })

  return await DB_CLIENT.send(txWriteCommand)
}

// eof
