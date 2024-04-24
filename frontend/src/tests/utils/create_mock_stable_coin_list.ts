import { QueryObserverSuccessResult } from '@tanstack/react-query';

import { StableCoin, StableCoinsListResponse } from '@/hooks/useStableCoinsList';

import { TEST_WALLET_ACCOUNT_ADDRESS } from './create_mock_wallet_account';

export const TEST_STABLE_COIN1: Partial<StableCoin> = {
  txid: '1',
  ticker: 'PRV',
  name: 'Pravica Token',
  deploy_addresses: {
    cash_cap: TEST_WALLET_ACCOUNT_ADDRESS,
    packageId: TEST_WALLET_ACCOUNT_ADDRESS,
    token_policy: TEST_WALLET_ACCOUNT_ADDRESS,
    token_supply: TEST_WALLET_ACCOUNT_ADDRESS,
    treasury_cap: TEST_WALLET_ACCOUNT_ADDRESS,
    token_policy_cap: TEST_WALLET_ACCOUNT_ADDRESS,
    pauser: TEST_WALLET_ACCOUNT_ADDRESS,
    deployer: TEST_WALLET_ACCOUNT_ADDRESS,
  },
  address_roles: ['pause', 'freeze', 'cashOut', 'cashIn', 'burn'],
};

export const TEST_STABLE_COIN2: Partial<StableCoin> = {
  txid: '2',
  ticker: 'SSS',
  name: 'S3 Money Token',
  deploy_addresses: {
    cash_cap: TEST_WALLET_ACCOUNT_ADDRESS,
    packageId: TEST_WALLET_ACCOUNT_ADDRESS,
    token_policy: TEST_WALLET_ACCOUNT_ADDRESS,
    token_supply: TEST_WALLET_ACCOUNT_ADDRESS,
    treasury_cap: TEST_WALLET_ACCOUNT_ADDRESS,
    token_policy_cap: TEST_WALLET_ACCOUNT_ADDRESS,
    pauser: TEST_WALLET_ACCOUNT_ADDRESS,
    deployer: TEST_WALLET_ACCOUNT_ADDRESS,
  },
  address_roles: ['pause', 'freeze', 'cashOut', 'cashIn', 'burn'],
};

export const createMockStableCoinList = (mockData?: unknown) => (accountAddress: string | undefined) => ({
  data: {
    accountAddress: accountAddress,
    coins: [
      TEST_STABLE_COIN1,
      TEST_STABLE_COIN2,
    ],
  },
  error: null,
  isError: false,
  isPending: false,
  isLoading: false,
  isLoadingError: false,
  isRefetchError: false,
  isSuccess: true,
  status: 'success',
  ...(mockData || {}),
}) as QueryObserverSuccessResult<StableCoinsListResponse>;
