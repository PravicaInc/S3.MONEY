import fs from 'fs'

import * as IFace from './interfaces'

const CWD = process.cwd()
const WORK_DIR = process.env.WORK_DIR || `${CWD}/contracts`

const TICKER_REGEX = new RegExp(/^[-+_$\w\d]+$/)
const ADDRESS_REGEX = new RegExp(/0x[a-f0-9]{64}$/)

export function validCreate(data: IFace.ICreatePackageRequest): IFace.IValid {
  const stringFields = ['ticker', 'name', 'decimals'] // , "address"];

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

  if (data.ticker == '' || data.ticker == '$' || data.ticker.length > 6) {
    console.log(`invalid ticker name: ${data.ticker}`)
    return {error: `invalid ticker name: ${data.ticker}`}
  }

  if (!data.ticker.startsWith('$')) {
    console.log(`ticker must start with $: ${data.ticker}`)
    return {error: `ticker must start with $: ${data.ticker}`}
  }

  // check for invalid characters
  if (!TICKER_REGEX.test(data.ticker.substring(1))) {
    console.log(`ticker must be alphanumeric with no special characters: ${data.ticker}`)
    return {
      error: `ticker must be alphanumeric with no special characters: ${data.ticker}`,
    }
  }

  // downcase the package name and remove $
  data.packageName = data.ticker.toLowerCase().trim().substring(1)
  data.description = data.name

  data.initialSupply = data.initialSupply || '0'
  data.maxSupply = data.maxSupply || '0'

  const path = `${WORK_DIR}/${data.address}/${data.packageName}`
  if (fs.existsSync(path)) {
    console.log(`package directory already exists: ${data.address}/${data.packageName}`)
    return {
      error: `package directory already exists: ${data.address}/${data.packageName}`,
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

export function validCancel(data: IFace.IPackageCreated): IFace.IValid {
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

  if (!TICKER_REGEX.test(data.ticker.substring(1))) {
    console.log(`ticker must be alphanumeric with no special characters: ${data.ticker}`)
    return {
      error: `ticker must be alphanumeric with no special characters: ${data.ticker}`,
    }
  }

  // downcase the package name and remove $
  data.packageName = data.ticker.toLowerCase().trim().substring(1)

  let path = `${WORK_DIR}/${data.address}/${data.packageName}`
  if (!fs.existsSync(path)) {
    console.log(`package directory does not exist: ${data.address}/${data.packageName}`)
    return {
      error: `package directory does not exist: ${data.address}/${data.packageName}`,
    }
  }

  // cannot cancel a published package
  path = `${WORK_DIR}/${data.address}/${data.packageName}.json`
  if (fs.existsSync(path)) {
    console.log(`package already published: ${data.address}/${data.packageName}`)
    return {
      error: `package already published: ${data.address}/${data.packageName}`,
    }
  }

  return {error: '', data: data}
}

export function validPublish(data: IFace.IPackageCreated): IFace.IValid {
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

  if (!TICKER_REGEX.test(data.ticker.substring(1))) {
    console.log(`ticker must be alphanumeric with no special characters: ${data.ticker}`)
    return {
      error: `ticker must be alphanumeric with no special characters: ${data.ticker}`,
    }
  }

  // downcase the package name and remove $
  data.packageName = data.ticker.toLowerCase().trim().substring(1)

  let path = `${WORK_DIR}/${data.address}/${data.packageName}`
  if (!fs.existsSync(path)) {
    console.log(`package directory does not exist: ${data.address}/${data.packageName}`)
    return {
      error: `package directory does not exist: ${data.address}/${data.packageName}`,
    }
  }

  path = `${WORK_DIR}/${data.address}/${data.packageName}.json`
  if (fs.existsSync(path)) {
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
