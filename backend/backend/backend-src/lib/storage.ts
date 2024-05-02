/**
 * @file Functions related to storing packages and icons on AWS S3.
 */

import {DeleteObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import {createHmac} from 'crypto'
import fs from 'fs'
import {S3} from '../constants'
import {IPackageIcon} from '../interfaces'

const S3_CLIENT = new S3Client()

/**
 * Create a presigned URL for uploading an icon to S3.
 *
 * @param {IPackageIcon} data - icon data
 * @returns {Promise<string>} URL to upload the icon to.
 */
export async function createPresignedUrlForIcon(data: IPackageIcon): Promise<string> {
  const key = createKeyForIcon(data.address, data.fileName)

  const command = new PutObjectCommand({
    Bucket: S3.BUCKET,
    Key: key,
    ACL: 'public-read',
  })

  return getSignedUrl(S3_CLIENT, command, {expiresIn: S3.ICON_URL_TTL})
}

/**
 * Upload a package to S3.
 * App Runner services do not have access to permanent storage.
 * We upload the zip file to S3 as part of the /create request.
 *
 * @param {string} address - SUI address of package creator
 * @param {string} moduleName - main package module
 * @param {string} zipPath - path to the zip file to upload
 * @returns {string} bucket key of the uploaded file
 */
export async function uploadPackageZip(address: string, moduleName: string, zipPath: string) {
  const key = createKeyForZip(address, moduleName)

  const command = new PutObjectCommand({
    Bucket: S3.BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: fs.readFileSync(zipPath), // about 300-400 kbytes
    ContentType: 'application/zip',
  })

  await S3_CLIENT.send(command)

  return key
}

/**
 * Delete an uploaded package from S3.
 * This is called when the deployer cancels the deployment to the blockchain, usually
 * by closing the wallet popup.
 *
 * @param {string} address - SUI address of package creator
 * @param {string} moduleName - main package module
 */
export async function deletePackageZip(address: string, moduleName: string) {
  const key = createKeyForZip(address, moduleName)

  const command = new DeleteObjectCommand({
    Bucket: S3.BUCKET,
    Key: key,
  })

  return await S3_CLIENT.send(command)
}

function createKeyForIcon(address: string, filename: string): string {
  // use .png as the default extension if we cannot figure it out
  let ext = '.png'
  if (filename.includes('.')) {
    ext = filename.split('.').slice(-1)[0]
    if (ext.length > 4) ext = ext.slice(0, 4)
  }

  const name = createHmac('sha256', new Date().toISOString()).update(filename).digest('hex')
  return `icons/${address}/${name}.${ext}`
}

function createKeyForZip(address: string, moduleName: string) {
  return `packages/${address}/${moduleName}.zip`
}

// eof
