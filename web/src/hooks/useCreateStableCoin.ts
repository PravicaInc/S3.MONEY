import { SuiSignAndExecuteTransactionBlockOutput } from '@mysten/wallet-standard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { ApiManager } from '@/services/api';

const createApi = new ApiManager(
  process.env.NEXT_PUBLIC_API_DOMAIN as string,
  '/create'
);
const cancelApi = new ApiManager(
  process.env.NEXT_PUBLIC_API_DOMAIN as string,
  '/cancel'
);
const publishedApi = new ApiManager(
  process.env.NEXT_PUBLIC_API_DOMAIN as string,
  '/published'
);

export enum suiNetworkList {
  localnet = 'localnet',
  devnet = 'devnet',
  testnet = 'testnet',
  mainnet = 'mainnet',
}

export interface CreateStableCoinData {
  walletAddress: string;
  ticker: string;
  decimals: number;
  name?: string | undefined;
  description?: string | undefined;
  maxSupply?: number;
  initialSupply?: number;
  network?: suiNetworkList;
  icon?: string;
  roles?: Record<string, string | undefined>;
}

export interface CreateStableCoinApiPostResponse {
  modules: number[][] | string[];
  dependencies: string[];
}

export interface RemoveNotPublishedStableCoinData {
  walletAddress: string;
  ticker: string;
}

export interface RemoveNotPublishedStableCoinApiPostResponse {
  status: string;
  message: string;
}

export interface SavePublishedStableCoinData {
  walletAddress: string;
  ticker: string;
  transactionID: string;
  data: SuiSignAndExecuteTransactionBlockOutput;
}

export interface SavePublishedStableCoinApiPostResponse {
  status: string;
  packages: SuiSignAndExecuteTransactionBlockOutput[];
}

export const useCreateStableCoin = () => {
  const queryClient = useQueryClient();

  return ({
    create: useMutation({
      mutationFn: async ({
        walletAddress,
        ticker,
        name,
        description,
        decimals,
        maxSupply,
        initialSupply,
        network = suiNetworkList.testnet,
        icon,
        roles,
      }: CreateStableCoinData) => createApi.post({
        address: walletAddress,
        ticker,
        name,
        description,
        decimals,
        maxSupply,
        initialSupply,
        network,
        icon_url: icon,
        roles,
      })
        .then((response: AxiosResponse<CreateStableCoinApiPostResponse>) => response.data),
    }),
    removeNotPublishedStableCoin: useMutation({
      mutationFn: async ({
        walletAddress,
        ticker,
      }: RemoveNotPublishedStableCoinData) => cancelApi.post({
        address: walletAddress,
        ticker,
        created: false,
      })
        .then((response: AxiosResponse<RemoveNotPublishedStableCoinApiPostResponse>) => response.data),
    }),
    savePublishedStableCoin: useMutation({
      mutationFn: async ({
        walletAddress,
        ticker,
        transactionID,
        data,
      }: SavePublishedStableCoinData) => publishedApi.post({
        address: walletAddress,
        ticker,
        txid: transactionID,
        created: true,
        data,
      })
        .then((response: AxiosResponse<SavePublishedStableCoinApiPostResponse>) => {
          queryClient.invalidateQueries({
            queryKey: ['stableCoinsList', walletAddress],
          });

          return response.data;
        }),
    }),
  });
};
