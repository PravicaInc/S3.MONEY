import { getFullnodeUrl, MoveValue, SuiClient } from '@mysten/sui.js/client';
import type { SuiSignAndExecuteTransactionBlockOutput } from '@mysten/wallet-standard';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { ApiManager } from '@/services/api';

export interface StableCoin {
  id: string;
  name: string;
  tokenName: string;
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
  const transactions = packages.map(({ deploy_data }) => deploy_data);

  const coinMetadataTransactions = await Promise.all(
    transactions
      .map(({ objectChanges }) => {
        const coinMetadataTransaction = objectChanges
          ?.find(objectChange => objectChange.type === 'created' && objectChange.objectType?.includes('CoinMetadata'));

        const client = new SuiClient({ url: getFullnodeUrl('testnet') });

        return coinMetadataTransaction?.type === 'created'
          ? client.getObject({
            id: coinMetadataTransaction.objectId,
            options: {
              showContent: true,
              showDisplay: true,
              showOwner: true,
              showPreviousTransaction: true,
              showStorageRebate: true,
              showType: true,
            },
          })
          : Promise.resolve(null);
      })
  );

  return {
    accountAddress,
    coins: coinMetadataTransactions
      .map((coinMetadataTransaction, idx) => {
        if (coinMetadataTransaction === null || coinMetadataTransaction?.data?.content?.dataType !== 'moveObject') {
          return null;
        }

        const fields = coinMetadataTransaction?.data?.content?.fields as {
          [key: string]: MoveValue;
        };

        return {
          id: transactions[idx].digest,
          name: fields?.symbol,
          tokenName: fields?.name,
          icon: fields?.icon_url,
        };
      })
      .filter(coin => !!coin)
      .map(coin => coin as StableCoin),
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
