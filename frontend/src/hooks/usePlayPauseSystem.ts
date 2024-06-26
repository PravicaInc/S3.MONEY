import { useSignAndExecuteTransactionBlock, useSuiClient } from '@mysten/dapp-kit';
import { SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiSignAndExecuteTransactionBlockOutput } from '@mysten/wallet-standard';
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';

import { useBuildTransaction } from './useBuildTransaction';

const is_paused = async (suiClient: SuiClient, txid: string): Promise<boolean> => {
  const { data } = (
    await suiClient.getObject({ id: txid, options: { showContent: true } })
  );

  return data?.content?.dataType === 'moveObject'
    // @ts-expect-error data.content.fields can be anything
    ? data.content.fields.value.fields.paused
    : false;
};

export const useIsSystemPaused = (
  txid?: string,
  queryOption?: Omit<UseQueryOptions<boolean, Error, boolean>, 'queryKey'>
) => {
  const suiClient = useSuiClient();

  return useQuery<boolean>({
    ...queryOption,
    queryKey: ['is-paused', txid],
    queryFn: () => suiClient && txid
      ? is_paused(suiClient, txid)
      : Promise.resolve(false),
  });
};

export const usePauseSystem = () => {
  const signAndExecuteTransactionBlock = useSignAndExecuteTransactionBlock();
  const queryClient = useQueryClient();
  const buildTransaction = useBuildTransaction();

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
    }): Promise<SuiSignAndExecuteTransactionBlockOutput> => {
      const txb = new TransactionBlock();

      txb.moveCall({
        target: `${packageId}::${packageName}::pause`,
        typeArguments: [`${packageId}::${packageName}::${packageName.toUpperCase()}`],
        arguments: [
          txb.object(tokenPolicyCap),
          txb.object(tokenPolicy),
        ],
      });

      await buildTransaction.mutateAsync(txb);

      const data = await signAndExecuteTransactionBlock.mutateAsync({
        transactionBlock: txb,
        requestType: 'WaitForLocalExecution',
      });

      queryClient.invalidateQueries({ queryKey: ['is-paused', pauser] });

      return data;
    },
  });
};

export const usePlaySystem = () => {
  const signAndExecuteTransactionBlock = useSignAndExecuteTransactionBlock();
  const queryClient = useQueryClient();
  const buildTransaction = useBuildTransaction();

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
    }): Promise<SuiSignAndExecuteTransactionBlockOutput> => {
      const txb = new TransactionBlock();

      txb.moveCall({
        target: `${packageId}::${packageName}::unpause`,
        typeArguments: [`${packageId}::${packageName}::${packageName.toUpperCase()}`],
        arguments: [
          txb.object(tokenPolicyCap),
          txb.object(tokenPolicy),
        ],
      });

      await buildTransaction.mutateAsync(txb);

      const data = await signAndExecuteTransactionBlock.mutateAsync({
        transactionBlock: txb,
        requestType: 'WaitForLocalExecution',
      });

      queryClient.invalidateQueries({ queryKey: ['is-paused', pauser] });

      return data;
    },
  });
};
