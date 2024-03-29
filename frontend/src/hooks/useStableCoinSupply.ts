import { useSignAndExecuteTransactionBlock, useSuiClient } from '@mysten/dapp-kit';
import { SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { UndefinedInitialDataOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useBuildTransaction } from './useBuildTransaction';
import { StableCoin } from './useStableCoinsList';

interface StableCoinCurrentSupplyObject {
  objectId: string;
  digest: string;
  content: {
    dataType: 'moveObject';
    type: string;
    hasPublicTransfer: boolean;
    fields: {
      id: {
        id: string;
      }
      total_supply: {
        type: string;
        fields: {
          value: string;
        }
      }
    }
  }
}

interface StableCoinMaxSupplyObject {
  objectId: string;
  digest: string;
  content: {
    dataType: 'moveObject';
    type: string;
    hasPublicTransfer: boolean;
    fields: {
      id: {
        id: string;
      }
      max_supply: string;
    }
  }
}

const getStableCoinCurrentSupply = async (suiClient: SuiClient, txid: string): Promise<number> => {
  const { data } = await suiClient.getObject({
    id: txid,
    options: {
      showContent: true,
    },
  });

  return parseInt((data as unknown as StableCoinCurrentSupplyObject).content.fields.total_supply.fields.value);
};

const getStableCoinMaxSupply = async (suiClient: SuiClient, txid: string): Promise<number> => {
  const { data } = await suiClient.getObject({
    id: txid,
    options: {
      showContent: true,
    },
  });

  return parseInt((data as unknown as StableCoinMaxSupplyObject).content.fields.max_supply);
};

export const useStableCoinCurrentSupply = (
  stableCoin?: StableCoin,
  queryOption?: Omit<UndefinedInitialDataOptions<number, Error, number>, 'queryKey'>
) => {
  const suiClient = useSuiClient();

  return useQuery<number>({
    ...queryOption,
    queryKey: ['stable-coin-current-supply', stableCoin?.deploy_addresses.treasury_cap],
    queryFn: () => suiClient && stableCoin?.deploy_addresses.treasury_cap
      ? getStableCoinCurrentSupply(suiClient, stableCoin.deploy_addresses.treasury_cap)
      : Promise.resolve(0),
  });
};

export const useStableCoinMaxSupply = (
  stableCoin?: StableCoin,
  queryOption?: Omit<UndefinedInitialDataOptions<number, Error, number>, 'queryKey'>
) => {
  const suiClient = useSuiClient();

  return useQuery<number>({
    ...queryOption,
    queryKey: ['stable-coin-max-supply', stableCoin?.deploy_addresses.token_supply],
    queryFn: () => suiClient && stableCoin?.deploy_addresses.token_supply
      ? getStableCoinMaxSupply(suiClient, stableCoin.deploy_addresses.token_supply)
      : Promise.resolve(0),
  });
};

export const useMintTo = () => {
  const signAndExecuteTransactionBlock = useSignAndExecuteTransactionBlock();
  const buildTransaction = useBuildTransaction();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      deployAddresses,
      packageName,
      packageId,
      treasuryCap,
      tokenPolicy,
      tokenSupply,
      amount,
    }: {
      deployAddresses: string,
      packageName: string,
      packageId: string,
      treasuryCap: string,
      tokenPolicy: string,
      tokenSupply: string,
      amount: number,
    }): Promise<void> => {
      const txb = new TransactionBlock();

      txb.moveCall({
        target: `${packageId}::${packageName}::mint`,
        typeArguments: [`${packageId}::${packageName}::${packageName.toUpperCase()}`],
        arguments: [
          txb.object(treasuryCap),
          txb.object(tokenPolicy),
          txb.object(tokenSupply),
          txb.pure(amount),
          txb.pure(deployAddresses),
        ],
      });

      await buildTransaction.mutateAsync(txb);

      await signAndExecuteTransactionBlock.mutateAsync({
        transactionBlock: txb,
        requestType: 'WaitForLocalExecution',
      });

      queryClient.invalidateQueries({
        queryKey: ['stable-coin-current-supply', treasuryCap],
      });
      queryClient.invalidateQueries({
        queryKey: ['stable-coin-max-supply', tokenSupply],
      });
    },
  });
};
