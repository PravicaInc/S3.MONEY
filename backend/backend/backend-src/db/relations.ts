/**
 * @file Functions related to DynamoDB operations for related wallets.
 */

import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  TransactWriteItem,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import slug from 'slug';

import { DB } from '../constants';
import * as IFace from '../interfaces';

const DB_CLIENT = new DynamoDBClient();

/**
 * Get all relations for a package.
 *
 * @param {string} pkgAddress - address of a deployed package
 */
export async function getRelations(pkgAddress: string) {
  const command = new QueryCommand({
    TableName: DB.RELATED_TABLE,
    KeyConditionExpression: 'address = :address',
    ExpressionAttributeValues: marshall({
      ':address': pkgAddress,
    }),
    ProjectionExpression: 'slug, label, wallet_address',
  });

  const response = await DB_CLIENT.send(command);

  if (response.Items === undefined) {
    return [];
  }

  return response.Items?.map(item => unmarshall(item)) ?? [];
}

/**
 * Get a relation by package address and slug.
 *
 * @param {string} pkgAddress - address of the package
 * @param {string} slug - slug of the relation's label
 */
export async function getRelation(pkgAddress: string, slug: string) {
  const command = new GetItemCommand({
    TableName: DB.RELATED_TABLE,
    Key: marshall({
      address: pkgAddress,
      slug: slug,
    }),
  });

  const response = await DB_CLIENT.send(command);

  if (response.Item === undefined) {
    return null;
  }

  return unmarshall(response.Item);
}

/**
 * Create a relation against a package.
 *
 * @param {string} pkgAddress - address of the package
 * @param {IFace.IRelatedCreate} data
 */
export async function createRelation(pkgAddress: string, data: IFace.IRelationCreate) {
  // check for existing labels -- cannot create multiple relations with the same label
  const labelSlug = slug(data.label);
  const existing = await getRelation(pkgAddress, labelSlug);

  if (existing !== null) {
    return { error: `label '${data.label}' already exists for address: ${existing.address}` };
  }

  const command = new PutItemCommand({
    TableName: DB.RELATED_TABLE,
    Item: marshall({
      address: pkgAddress,
      slug: labelSlug,
      label: data.label,
      wallet_address: data.address,
    }),
  });

  return await DB_CLIENT.send(command);
}

/**
 * Delete a relation.
 *
 * @param {string} pkgAddress - address of the package
 * @param {string} slug - slug of the relation's label
 */
export async function deleteRelation(pkgAddress: string, slug: string) {
  const existing = await getRelation(pkgAddress, slug);

  // early return if the relation does not exist
  if (existing === null) {
    return;
  }

  const command = new DeleteItemCommand({
    TableName: DB.RELATED_TABLE,
    Key: marshall({
      address: pkgAddress,
      slug: slug,
    }),
  });

  return await DB_CLIENT.send(command);
}

/**
 * Rename a relation's label.
 *
 * @param {string} pkgAddress - address of the package
 * @param {string} existingSlug - slug of the existing relation's label
 * @param {IFace.IRelatedModify} data - new label for the relation
 */
export async function renameRelation(pkgAddress: string, existingSlug: string, data: IFace.IRelationRename) {
  const existing = await getRelation(pkgAddress, existingSlug);

  if (existing == null) {
    return { error: `entry '${existingSlug}' does not exist for address: ${pkgAddress}` };
  }

  // check if the new label already exists
  const newSlug = slug(data.label);
  const maybe = await getRelation(pkgAddress, newSlug);

  if (maybe !== null) {
    return { error: `label '${data.label}' already exists for address: ${pkgAddress}` };
  }

  const items: TransactWriteItem[] = [
    {
      Delete: {
        TableName: DB.RELATED_TABLE,
        Key: marshall({
          address: pkgAddress,
          slug: existingSlug,
        }),
      },
    },
    {
      Put: {
        TableName: DB.RELATED_TABLE,
        Item: marshall({
          address: pkgAddress,
          slug: newSlug,
          label: data.label,
          wallet_address: existing.wallet_address,
        }),
      },
    },
  ];

  const txWriteCommand = new TransactWriteItemsCommand({
    TransactItems: items,
  });

  await DB_CLIENT.send(txWriteCommand);
}
