import { TransactionBlock } from '@mysten/sui.js/transactions';
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
  walletAddress: string,
  packageName: string,
  symbol: string,
  name?: string | undefined,
  description?: string | undefined,
  decimals: number,
  network: suiNetworkList,
}

export const useWallet = () => {
  const connectWallet = useMutation(
    {
      mutationFn: async ({
        walletAddress,
        packageName,
        symbol,
        name,
        description,
        decimals,
        network,
      }: ConnectWalletData) => {
        const txb = new TransactionBlock();
        const { modules, dependencies } = await createApi.post({
          address: walletAddress,
          packageName,
          symbol,
          name,
          description,
          decimals,
          network,
        })
          .then((response: AxiosResponse<createApiPostResponse>) => response.data);

        return txb.publish({ modules, dependencies });
      },
    }
  );

  return {
    connectWallet,
  };
};
