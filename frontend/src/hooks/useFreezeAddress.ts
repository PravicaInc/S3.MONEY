import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useMutation } from '@tanstack/react-query';

export const useFreezeAddress = () => {
  const signAndExecuteTransactionBlock = useSignAndExecuteTransactionBlock();

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

      await signAndExecuteTransactionBlock.mutateAsync({
        transactionBlock: txb,
        requestType: 'WaitForLocalExecution',
      });
    },
  });
};
