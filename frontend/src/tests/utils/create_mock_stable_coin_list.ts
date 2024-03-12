import { QueryObserverSuccessResult } from '@tanstack/react-query';

import { StableCoin, StableCoinsListResponse } from '@/hooks/useStableCoinsList';

export const TEST_STABLE_COIN1: StableCoin = {
  id: '1',
  name: 'PRV',
  tokenName: 'Pravica Token',
};

export const TEST_STABLE_COIN2: StableCoin = {
  id: '2',
  name: 'SSS',
  tokenName: 'S3 Money Token',
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
