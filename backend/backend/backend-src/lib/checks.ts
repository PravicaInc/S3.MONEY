import fs from 'fs'

import * as IFace from './interfaces'
import {getPackageDB} from './aws'

const CWD = process.cwd()
const WORK_DIR = process.env.WORK_DIR || `${CWD}/contracts`

const TICKER_REGEX = new RegExp(/^[-+_$\w\d]+$/)
const ADDRESS_REGEX = new RegExp(/0x[a-f0-9]{64}$/)

export async function validCreate(data: IFace.ICreatePackageRequest): Promise<IFace.IValid> {
  const stringFields = ['ticker', 'name', 'decimals', 'address']

  for (const field of stringFields) {
    if (!(field in data)) {
      console.log(`missing field: ${field}`)
      return {error: `missing field: ${field}`}
    }
  }

  if (data.decimals < 0 || data.decimals > 8) {
    console.log(`wrong number of decimals: ${data.decimals}`)
    return {error: `wrong number of decimals: ${data.decimals}`}
  }

  // upcase the ticker
  data.ticker = data.ticker.toUpperCase().trim()

  const v = validTicker(data.ticker)
  if (v !== '') {
    console.log(v)
    return {error: v}
  }

  // downcase the package name and remove $
  data.packageName = data.ticker.toLowerCase().trim().substring(1)
  data.description = data.name

  data.initialSupply = data.initialSupply || '0'
  data.maxSupply = data.maxSupply || '0'

  const path = `${WORK_DIR}/${data.address}/${data.packageName}`
  if (fs.existsSync(path)) {
    fs.rmSync(path, {recursive: true})
  }

  // FIXME: can only deploy one package for each ticker
  const pkg = await getPackageDB(data.address, data.packageName)
  if (pkg !== null && pkg.deploy_status == IFace.PackageStatus.PUBLISHED) {
    console.log(`package already published: ${data.address}/${data.packageName}`)
    return {
      error: `package already published: ${data.address}/${data.packageName}`,
    }
  }

  if (data.icon_url !== undefined) {
    data.icon_url = data.icon_url.trim()
    try {
      new URL(data.icon_url)
    } catch (e) {
      console.log(`invalid icon_url: ${data.icon_url}`)
      return {error: `invalid icon_url: ${data.icon_url}`}
    }
    data.icon_url = `option::some(url::new_unsafe_from_bytes(b"${data.icon_url}"))`
  } else {
    data.icon_url = 'option::none()'
  }

  // TODO: add more checks

  return {error: '', data: data}
}

export async function validCancel(data: IFace.IPackageCreated): Promise<IFace.IValid> {
  const stringFields = ['address', 'ticker']

  for (const field of stringFields) {
    if (!(field in data)) {
      console.log(`missing field: ${field}`)
      return {error: `missing field: ${field}`}
    }
  }

  if (!('created' in data) || typeof data.created !== 'boolean') {
    console.log('missing field: created')
    return {error: 'missing field: created'}
  }

  if (data.created !== false) {
    console.log('created should be false')
    return {error: 'created should be false'}
  }

  const v = validTicker(data.ticker)
  if (v !== '') {
    console.log(v)
    return {error: v}
  }

  // downcase the package name and remove $
  data.packageName = data.ticker.toLowerCase().trim().substring(1)

  // cannot cancel a published package
  const pkg = await getPackageDB(data.address, data.packageName)
  if (pkg !== null && pkg.deploy_status == IFace.PackageStatus.PUBLISHED) {
    console.log(`package already published: ${data.address}/${data.packageName}`)
    return {
      error: `package already published: ${data.address}/${data.packageName}`,
    }
  }

  return {error: '', data: data}
}

export async function validPublish(data: IFace.IPackageCreated): Promise<IFace.IValid> {
  const stringFields = ['address', 'ticker', 'txid', 'data']

  for (const field of stringFields) {
    if (!(field in data)) {
      console.log(`missing field: ${field}`)
      return {error: `missing field: ${field}`}
    }
  }

  if (!('created' in data) || typeof data.created !== 'boolean') {
    console.log('missing field: created')
    return {error: 'missing field: created'}
  }

  if (data.created !== true) {
    console.log('created should be true')
    return {error: 'created should be true'}
  }

  const v = validTicker(data.ticker)
  if (v !== '') {
    console.log(v)
    return {error: v}
  }

  // downcase the package name and remove $
  data.packageName = data.ticker.toLowerCase().trim().substring(1)

  // FIXME: replace this with a better check
  /*
  let path = `${WORK_DIR}/${data.address}/${data.packageName}`
  if (!fs.existsSync(path)) {
    console.log(`package directory does not exist: ${data.address}/${data.packageName}`)
    return {
      error: `package directory does not exist: ${data.address}/${data.packageName}`,
    }
  }
  */

  const pkg = await getPackageDB(data.address, data.packageName)
  if (pkg !== null && pkg.deploy_status == IFace.PackageStatus.PUBLISHED) {
    console.log(`package already published: ${data.address}/${data.packageName}`)
    return {
      error: `package already published: ${data.address}/${data.packageName}`,
    }
  }
  return {error: '', data: data}
}

export function validAddress(address: string): IFace.IValid {
  if (!ADDRESS_REGEX.test(address)) {
    console.log(`invalid address: ${address}`)
    return {error: `invalid address: ${address}`}
  }

  return {error: ''}
}

function validTicker(ticker: string): string {
  if (ticker == '' || ticker == '$' || ticker.length > 6) {
    return `invalid ticker name: ${ticker}`
  }

  if (!ticker.startsWith('$')) {
    return `ticker must start with $: ${ticker}`
  }

  // check for invalid characters
  if (!TICKER_REGEX.test(ticker.substring(1))) {
    return `ticker must be alphanumeric with no special characters: ${ticker}`
  }

  return ''
}
