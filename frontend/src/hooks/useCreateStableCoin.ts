import { useMutation } from '@tanstack/react-query';
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
  packageName: string;
  ticker: string;
  decimals: number;
  name?: string | undefined;
  description?: string | undefined;
  maxSupply?: number;
  initialSupply?: number;
  network?: suiNetworkList;
  icon?: string;
}

export interface createStableCoinApiPostResponse {
  modules: number[][] | string[];
  dependencies: string[];
}

export interface removeNotPublishedStableCoinData {
  walletAddress: string;
  ticker: string;
}

export interface removeNotPublishedStableCoinApiPostResponse {
  status: string;
  message: string;
}

export interface savePublishedStableCoinData {
  walletAddress: string;
  ticker: string;
  transactionID: string;
  data: object;
}

export interface savePublishedStableCoinApiPostResponse {
  status: string;
  packages: object[];
}

export const useCreateStableCoin = () => ({
  create: useMutation({
    mutationFn: async ({
      walletAddress,
      packageName,
      ticker,
      name,
      description,
      decimals,
      maxSupply,
      initialSupply,
      network = suiNetworkList.testnet,
      icon,
    }: CreateStableCoinData) => createApi.post({
      address: walletAddress,
      packageName,
      ticker,
      name,
      description,
      decimals,
      maxSupply,
      initialSupply,
      network,
      icon_url: icon,
    })
      .then((response: AxiosResponse<createStableCoinApiPostResponse>) => response.data),
  }),
  removeNotPublishedStableCoin: useMutation({
    mutationFn: async ({
      walletAddress,
      ticker,
    }: removeNotPublishedStableCoinData) => cancelApi.post({
      address: walletAddress,
      ticker,
      created: false,
    })
      .then((response: AxiosResponse<removeNotPublishedStableCoinApiPostResponse>) => response.data),
  }),
  savePublishedStableCoin: useMutation({
    mutationFn: async ({
      walletAddress,
      ticker,
      transactionID,
      data,
    }: savePublishedStableCoinData) => publishedApi.post({
      address: walletAddress,
      ticker,
      txid: transactionID,
      created: true,
      data,
    })
      .then((response: AxiosResponse<savePublishedStableCoinApiPostResponse>) => response.data),
  }),
});
