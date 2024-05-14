/**
 * @file Common constants used by the backend.
 */

import dotenv from 'dotenv';

dotenv.config();

export const S3 = {
  BUCKET: process.env.BUCKET,
  ICON_URL_TTL: 3600,
};

export const DB = {
  // tables for deployed contracts
  DEPLOYED_TABLE: process.env.DEPLOYED_TABLE || '',
  ROLES_TABLE: process.env.ROLES_TABLE || '',
  ROLES_INDEX: process.env.ROLES_INDEX || '',
  // tables for events and things derived from balance
  ADDRESS_EVENTS_TABLE: process.env.ADDRESS_EVENTS_TABLE || '',
  CONTRACT_EVENTS_TABLE: process.env.CONTRACT_EVENTS_TABLE || '',
  BALANCES_TABLE: process.env.BALANCES_TABLE || '',
  ALLOCATIONS_TABLE: process.env.ALLOCATIONS_TABLE || '',
  LASTFETCH_TABLE: process.env.LASTFETCH_TABLE || '',
  // table for related wallet addresses
  RELATED_TABLE: process.env.RELATED_TABLE || '',
  // tables for transaction volumes
  TXVOL_YEAR_TABLE: process.env.TXVOL_YEAR_TABLE || '',
  TXVOL_YEARMONTH_TABLE: process.env.TXVOL_YEARMONTH_TABLE || '',
  TXVOL_YEARMONTHDAY_TABLE: process.env.TXVOL_YEARMONTHDAY_TABLE || '',
  HOLDINGS_TABLE: process.env.HOLDINGS_TABLE || '',
};

// supply-constrained token template
// note: no leading or trailing slash
export const TOKEN_SUPPLY_PATH = 'coin_template/token3';

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
];

// keep these in sync with watcher/src/constants.ts and keep them sorted
export const HOLDINGS_BUCKETS = ['0k-1k', '1k-100k', '100k-1m', '1m+'];

// eof
