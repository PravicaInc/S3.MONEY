import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { DryRunTransactionBlockResponse } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useMutation } from '@tanstack/react-query';

export const useBuildTransaction = () => {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();

  return useMutation({
    mutationFn: async (txb: TransactionBlock): Promise<DryRunTransactionBlockResponse> => {
      txb.setSenderIfNotSet(account?.address as string);

      return suiClient.dryRunTransactionBlock({
        transactionBlock: await txb.build({
          client: suiClient,
        }),
      });
    },
  });
};
