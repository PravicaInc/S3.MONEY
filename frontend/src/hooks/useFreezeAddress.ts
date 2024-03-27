import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useMutation } from '@tanstack/react-query';

import { useBuildTransaction } from './useBuildTransaction';

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
