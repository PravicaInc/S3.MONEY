import { useSignAndExecuteTransactionBlock, useSuiClient } from '@mysten/dapp-kit';
import { SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const is_paused = async (suiClient: SuiClient, txid: string): Promise<boolean> => {
  const { data } = (
    await suiClient.getObject({ id: txid, options: { showContent: true } })
  );

  return data?.content?.dataType === 'moveObject'
    // @ts-expect-error data.content.fields can be anything
    ? data.content.fields.value.fields.paused
    : false;
};

export const useIsSystemPaused = (txid?: string) => {
  const suiClient = useSuiClient();

  return useQuery<boolean>({
    queryKey: ['is-paused', txid],
    queryFn: () => suiClient && txid
      ? is_paused(suiClient, txid)
      : Promise.resolve(false),
  });
};

export const usePauseSystem = () => {
  const signAndExecuteTransactionBlock = useSignAndExecuteTransactionBlock();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pauser,
      packageName,
      packageId,
      tokenPolicyCap,
      tokenPolicy,
    }: {
      pauser: string,
      packageName: string,
      packageId: string,
      tokenPolicyCap: string,
      tokenPolicy: string
    }): Promise<void> => {
      const txb = new TransactionBlock();

      txb.moveCall({
        target: `${packageId}::${packageName}::pause`,
        typeArguments: [`${packageId}::${packageName}::${packageName.toUpperCase()}`],
        arguments: [
          txb.object(tokenPolicyCap),
          txb.object(tokenPolicy),
        ],
      });

      await signAndExecuteTransactionBlock.mutateAsync({
        transactionBlock: txb,
        requestType: 'WaitForLocalExecution',
      });

      queryClient.invalidateQueries({ queryKey: ['is-paused', pauser] });
    },
  });
};
