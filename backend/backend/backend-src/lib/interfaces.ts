/**
 * @file Interfaces and types.
 */

import {SuiSignAndExecuteTransactionBlockOutput} from '@mysten/wallet-standard'

export interface PackageCreateRequest {
  address: string // creator's address
  network: string
  maxSupply: string // can be "0"
  initialSupply: string // can be "0"
  roles: RoleMap
  // coin metadata
  ticker: string // short name, usually five or fewer characters (uppercase)
  name: string
  description: string
  decimals: number
  icon_url: string // substituted in the contract
  raw_icon_url?: string // saved in the db
}
export interface PackageCreateResponse {
  status: string // 'ok' or 'error'
  message?: string // error message, if any
  modules?: string[]
  dependencies?: string[]
}

export interface ContractCreate extends PackageCreateRequest {
  packageName: string
}

export interface PackageCancelRequest {
  address: string
  ticker: string
  created: boolean
}

export interface PackageCancelResponse {
  status: string
  message: string
}

export interface PackagePublishRequest {
  address: string
  ticker: string
  txid: string
  created: boolean
  data: SuiSignAndExecuteTransactionBlockOutput
}

export interface PackagePublishResponse {
  status: string
  message: string
}

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

export enum PackageFilterKeys {
  DIGEST = 'digest',
  PACKAGE_NAME = 'packageName',
}

export type PackageFilter = {
  [key in PackageFilterKeys]: string
}

export interface CreatePackageRequest {
  // creator's address
  address: string
  // coin metadata
  ticker: string // short name, usually five or fewer characters (uppercase)
  name: string
  decimals: number
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
  decimals: number
  created: boolean
  initialSupply: string
  maxSupply: string
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

export interface IRelatedItem {
  label: string
  address: string
}
export interface IRelationCreate {
  label: string
  address: string
}
export interface IRelationDelete {
  label: string
}

export interface IRelationRename {
  label: string
}

export function reqToCreated(data: CreatePackageRequest, s3key: string | undefined): IPackageCreated {
  return {
    address: data.address,
    ticker: data.ticker,
    ticker_name: data.name,
    decimals: data.decimals,
    initialSupply: data.initialSupply ?? '0',
    maxSupply: data.maxSupply ?? '0',
    created: true,
    packageName: data.packageName,
    packageRoles: data.roles,
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
  cash_cap: string
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
    cash_cap: '',
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
      } else if (obj.objectType.includes('cash_::CashInCap<')) {
        data.cash_cap = obj.objectId
      }
    }
  }

  return data
}
