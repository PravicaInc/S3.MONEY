// TODO: use this properly, for type checking
export interface ICreatePackageRequest {
  // creator's address
  address: string
  // coin metadata
  ticker: string // short name, usually five or fewer characters (uppercase)
  decimals: number
  name: string
  icon_url?: string
  // for supply-constrainted contracts
  initialSupply?: string // can be "0"
  maxSupply?: string // can be "0"
  // set internally
  packageName?: string
  description?: string
}

// TODO: rename this to something more appropriate
export interface IPackageCreated {
  address: string
  ticker: string
  created: boolean
  // sent if created is true
  txid?: string
  data?: object
  // set internally
  packageName?: string
}

export function reqToCreated(data: ICreatePackageRequest): IPackageCreated {
  return {
    address: data.address,
    ticker: data.ticker,
    created: true,
    packageName: data.packageName,
  }
}

export interface IValid {
  error: string
  data?: object
}

export enum PackageStatus {
  CREATED = 'created',
  PUBLISHED = 'published',
}

export interface IPackageIcon {
  address: string
  ticker: string
  fileName: string
  mimeType: string
  // set internally
  packageName?: string
}
