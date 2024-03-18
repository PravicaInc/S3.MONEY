import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { ApiManager } from '@/services/api';

const createApi = new ApiManager(
  process.env.NEXT_PUBLIC_API_DOMAIN as string,
  '/create'
);

export interface createApiPostResponse {
  modules: number[][] | string[];
  dependencies: string[];
}

export enum suiNetworkList {
  localnet = 'localnet',
  devnet = 'devnet',
  testnet = 'testnet',
  mainnet = 'mainnet',
}

export interface ConnectWalletData {
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

export const useCreateStableCoin = () => useMutation(
  {
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
    }: ConnectWalletData) => createApi.post({
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
      .then((response: AxiosResponse<createApiPostResponse>) => response.data),
  }
);
