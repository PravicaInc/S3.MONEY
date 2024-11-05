export const FETCH_EVENTS_QUEUE = 's3money-watcher-queue-dev';

// actions from EventBridge and SQS
export const FETCH_EVENTS_ACTION = 'fetch-events';

export const STORE_HOLDINGS_ACTION = 'store-holdings';

export const PROCESS_PACKAGE_ACTION = 'process-package';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000000000000000000000000000';

// in seconds
export const DB_WRITE_SLEEP = 0.1;

export const API_FETCH_SLEEP = 0.5;

export const TESTNET_ENDPOINT = 'https://sui-testnet.mystenlabs.com/graphql';

export const TABLE_DEPLOYED = 's3m-contracts-dev';

// key: (address_package, event_timestamp)
// rest: list of events (insert row)
export const CONTRACT_EVENTS_TABLE = 's3m-contracts-events-dev';

// key: (address, event_timestamp)
// rest: list of events
export const ADDRESS_EVENTS_TABLE = 's3m-address-events-dev';

// key: (address, address_package)
// rest: balance, ticker, last_timestamp (upsert row)
export const BALANCES_TABLE = 's3m-balances-dev';

// key: address_package
export const BALANCES_BY_ADDRESS_PACKAGE_INDEX = 'address_package-index';

// key: (address_package, 'allocated' | 'unallocated')
// rest: amount, last_timestamp (upsert row)
export const ALLOCATION_TABLE = 's3m-allocation-dev';

// key: address_package,
// rest: last_timestamp of last event
export const LASTFETCH_TABLE = 's3m-contracts-lastfetch-dev';

// key: (address_package, period)
// value: amount
// period is 'yyyy', 'yyyy-mm', or 'yyyy-mm-dd' (string)
export const TXVOL_YEAR_TABLE = 's3m-txvol-yyyy-dev';

export const TXVOL_YEARMONTH_TABLE = 's3m-txvol-yyyymm-dev';

export const TXVOL_YEARMONTHDAY_TABLE = 's3m-txvol-yyyymmdd-dev';

// key: (address_package, period)
// value: hash of holdings (see below)
// period is a date in yyyy-mm-dd format
export const HOLDINGS_TABLE = 's3m-holdings-dev';

export const HOLDINGS_BUCKETS = {
  '0k-1k': [0, 1000],
  '1k-100k': [1000, 100000],
  '100k-1m': [100000, 1000000],
  '1m+': [1000000, Infinity],
};
