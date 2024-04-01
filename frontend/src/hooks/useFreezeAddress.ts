import { useSignAndExecuteTransactionBlock, useSuiClient } from '@mysten/dapp-kit';
import { SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useMutation, useQuery } from '@tanstack/react-query';

import { isSuiAddress } from '@/utils/validators';

import { useBuildTransaction } from './useBuildTransaction';
import { StableCoin } from './useStableCoinsList';

export const useFreezeAddress = () => {
  const signAndExecuteTransactionBlock = useSignAndExecuteTransactionBlock();
  const buildTransaction = useBuildTransaction();

  return useMutation({
    mutationFn: async ({
      walletAddress,
      packageName,
      packageId,
      tokenPolicyCap,
      tokenPolicy,
    }: {
      walletAddress: string,
      packageName: string,
      packageId: string,
      tokenPolicyCap: string,
      tokenPolicy: string
    }): Promise<void> => {
      const txb = new TransactionBlock();

      txb.moveCall({
        target: `${packageId}::${packageName}::freeze_address`,
        typeArguments: [`${packageId}::${packageName}::${packageName.toUpperCase()}`],
        arguments: [
          txb.object(tokenPolicyCap),
          txb.object(tokenPolicy),
          txb.pure.address(walletAddress),
        ],
      });

      await buildTransaction.mutateAsync(txb);

      await signAndExecuteTransactionBlock.mutateAsync({
        transactionBlock: txb,
        requestType: 'WaitForLocalExecution',
      });
    },
  });
};

export const isFrozenAccount = async (suiClient: SuiClient, stableCoin?: StableCoin, address?: string) => {
  if (stableCoin?.txid && address && isSuiAddress(address)) {
    const packageId = stableCoin.deploy_addresses.packageId;
    const packageName = stableCoin.package_name;
    const tokenPolicy = stableCoin.deploy_addresses.token_policy;

    const txb = new TransactionBlock();

    txb.moveCall({
      target: `${packageId}::${packageName}::is_frozen`,
      typeArguments: [`${packageId}::${packageName}::${packageName.toUpperCase()}`],
      arguments: [txb.object(tokenPolicy), txb.pure.address(address)],
    });

    const result = await suiClient.devInspectTransactionBlock({
      sender: stableCoin.package_roles.freeze,
      transactionBlock: txb,
    });

    return !!result.results?.[0].returnValues?.[0][0][0];
  }

  return false;
};

export const useIsFrozenAccount = (stableCoin?: StableCoin, address?: string) => {
  const suiClient = useSuiClient();

  return useQuery<boolean>({
    queryKey: ['is-freezed-account', stableCoin?.txid, address],
    queryFn: async () => isFrozenAccount(suiClient, stableCoin, address),
  });
};
