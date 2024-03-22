import type { SuiSignAndExecuteTransactionBlockOutput } from '@mysten/wallet-standard';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { ApiManager } from '@/services/api';

export interface StableCoin {
  txid: string;
  ticker: string;
  name: string;
  icon?: string;
}

export interface StableCoinsListResponse {
  accountAddress: string;
  coins: StableCoin[];
}

const packagesListApi = new ApiManager(
  process.env.NEXT_PUBLIC_API_DOMAIN as string,
  '/packages'
);

export interface packagesListApiGetByKeyResponse {
  status: 'ok',
  packages: {
    deploy_data: SuiSignAndExecuteTransactionBlockOutput,
    deploy_date: string,
    deploy_status: 'created' | 'published',
    package_name: string,
    ticker: string,
    ticker_name: string,
    txid: string,
    icon_url: string;
  }[],
}

const getStableCoinsList = async (accountAddress: string): Promise<StableCoinsListResponse> => {
  const { packages } = await packagesListApi.getByKey(accountAddress)
    .then((response: AxiosResponse<packagesListApiGetByKeyResponse>) => response.data)
    .then(data => ({
      ...data,
      packages: data.packages
        .filter(({ deploy_status }) => deploy_status === 'published')
        .sort(({ deploy_date: a }, { deploy_date: b }) => (new Date(b)).getTime() - (new Date(a)).getTime()),
    }));

  return {
    accountAddress,
    coins: packages
      .filter(({ deploy_status }) => deploy_status === 'published')
      .sort(({ deploy_date: a }, { deploy_date: b }) => (new Date(b)).getTime() - (new Date(a)).getTime())
      .map(({ txid, ticker_name, ticker, icon_url }) => ({
        txid,
        ticker,
        name: ticker_name,
        icon: icon_url,
      })),
  };
};

export const useStableCoinsList = (accountAddress: string | undefined) => {
  const query = useQuery<StableCoinsListResponse>({
    queryKey: ['stableCoinsList', accountAddress],
    queryFn: () => accountAddress
      ? getStableCoinsList(accountAddress)
      : Promise.resolve({} as StableCoinsListResponse),
  });

  return {
    ...query,
  };
};
