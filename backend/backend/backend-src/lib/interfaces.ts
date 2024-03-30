export enum PackageRoles {
  BURN = 'burn',
  MINT = 'mint', // should be same as burn
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

export interface IPackageSummary {
  packageId: string
  token_policy: string
  token_supply: string
  treasury_cap: string
  token_policy_cap: string
  pauser: string
  deployer: string
}

export interface IPackageDeployed {
  digest: string
  events: IPackageEvent[]
  objectChanges: IPackageObjectChange[]
  confirmedLocalExecution: boolean
}

interface IPackageEvent {
  packageId: string
  sender: string
  type: string
  id: object
}
export interface IPackageObjectChange {
  type: string
  objectType: string
  objectId: string
  packageId?: string
  sender?: string
}

export function packageSummary(objectChanges: IPackageObjectChange[]): IPackageSummary {
  let data: IPackageSummary = {
    packageId: '',
    token_policy: '',
    token_supply: '',
    treasury_cap: '',
    token_policy_cap: '',
    pauser: '',
    deployer: '',
  }

  for (const obj of objectChanges) {
    if (obj.type === 'published') {
      data.packageId = obj.packageId!
    } else {
      if (obj.objectType.includes('0x2::token::TokenPolicy<')) {
        data.token_policy = obj.objectId
      } else if (obj.objectType.includes('token_supply::TokenSupply<')) {
        data.token_supply = obj.objectId
      } else if (obj.objectType.includes('0x2::coin::TreasuryCap<')) {
        data.treasury_cap = obj.objectId
        data.deployer = obj.sender!
      } else if (obj.objectType.includes('0x2::token::TokenPolicyCap<')) {
        data.token_policy_cap = obj.objectId
      } else if (obj.objectType.includes('pauser_rule::Config>')) {
        data.pauser = obj.objectId
      }
    }
  }

  return data
}
