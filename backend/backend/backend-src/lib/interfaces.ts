export enum PackageRoles {
  BURN = 'burn',
  CASH_IN = 'cashIn',
  CASH_OUT = 'cashOut',
  FREEZE = 'freeze',
  PAUSE = 'pause',
}

export type RoleMap = {
  [key in PackageRoles]: string
}

// TODO: use this properly, for type checking
export interface ICreatePackageRequest {
  // creator's address
  address: string
  // coin metadata
  ticker: string // short name, usually five or fewer characters (uppercase)
  decimals: number
  name: string
  roles?: RoleMap
  icon_url?: string // substituted in the contract
  // for supply-constrainted contracts
  initialSupply?: string // can be "0"
  maxSupply?: string // can be "0"
  // set internally
  raw_icon_url?: string // copied from icon_url, unaltered
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
  package_zip?: string
  // set internally
  packageName?: string
  packageRoles?: RoleMap
  icon_url?: string
  ticker_name?: string
}

export function reqToCreated(data: ICreatePackageRequest, s3key: string | undefined): IPackageCreated {
  return {
    address: data.address,
    ticker: data.ticker,
    created: true,
    packageName: data.packageName,
    packageRoles: data.roles,
    ticker_name: data.name,
    icon_url: data.raw_icon_url,
    package_zip: s3key ?? '',
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
  fileName: string
  // set internally
  packageName?: string
}
