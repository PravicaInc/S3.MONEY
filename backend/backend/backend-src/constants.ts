/**
 * @file Common constants used by the backend.
 */

export const S3 = {
  BUCKET: 's3m-contracts-dev',
  ICON_URL_TTL: 3600,
}

export const DB = {
  // tables for deployed contracts
  DEPLOYED_TABLE: 's3m-contracts-dev',
  ROLES_TABLE: 's3m-roles-dev',
  ROLES_INDEX: 's3m-roles-by-address-index-dev',
  // tables for events and things derived from balance
  ADDRESS_EVENTS_TABLE: 's3m-address-events-dev',
  CONTRACT_EVENTS_TABLE: 's3m-contracts-events-dev',
  BALANCES_TABLE: 's3m-balances-dev',
  ALLOCATIONS_TABLE: 's3m-allocation-dev',
  LASTFETCH_TABLE: 's3m-contracts-lastfetch-dev',
  // table for related wallet addresses
  RELATED_TABLE: 's3m-related-dev',
  // tables for transaction volumes
  TXVOL_YEAR_TABLE: 's3m-txvol-yyyy-dev',
  TXVOL_YEARMONTH_TABLE: 's3m-txvol-yyyymm-dev',
  TXVOL_YEARMONTHDAY_TABLE: 's3m-txvol-yyyymmdd-dev',
}

// supply-constrained token template
// note: no leading or trailing slash
export const TOKEN_SUPPLY_PATH = `coin_template/token3`

// ticker names cannot be one of the following
export const RESERVED_TICKERS = [
  '$BAG',
  '$BCS',
  '$HEX',
  '$PAY',
  '$SUI',
  '$URI',
  '$COIN',
  '$MATH',
  '$CLOCK',
  '$EVENT',
  '$TABLE',
  '$TOKEN',
  '$TYPES',
]

// eof
