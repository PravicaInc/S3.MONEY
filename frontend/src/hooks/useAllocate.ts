import { useSignAndExecuteTransactionBlock, useSuiClient } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useBuildTransaction } from './useBuildTransaction';
import { getAllOwnedObjects } from './useCurrentBalance';
import { joinCoins } from './useStableCoinSupply';

export const useAllocate = () => {
  const signAndExecuteTransactionBlock = useSignAndExecuteTransactionBlock();
  const buildTransaction = useBuildTransaction();
  const queryClient = useQueryClient();
  const suiClient = useSuiClient();

  return useMutation({
    mutationFn: async ({
      senderAddresses,
      recipientAddresses,
      packageName,
      packageId,
      treasuryCap,
      tokenPolicy,
      tokenSupply,
      amount,
    }: {
      senderAddresses: string,
      recipientAddresses: string,
      packageName: string,
      packageId: string,
      treasuryCap: string,
      tokenPolicy: string,
      tokenSupply: string,
      amount: number,
    }): Promise<void> => {
      const coins = (await getAllOwnedObjects(suiClient, { owner: senderAddresses }))
        .filter(
          obj => obj.data?.content?.dataType === 'moveObject'
            && obj.data?.content?.type == `0x2::token::Token<${packageId}::${packageName}::${packageName.toUpperCase()}>`
        )
        .map(coin => {
          coin.data.content.fields.balance = parseFloat(coin.data.content.fields.balance as string);

          return coin;
        })
        .sort((coinA, coinB) => (
          (coinB.data.content.fields.balance as number) - (coinA.data.content.fields.balance as number)
        ));

      const coinsForAllocate = [];

      for (let currentAmount = amount, i = 0; currentAmount > 0 && i < coins.length; i++) {
        coinsForAllocate.push(coins[i]);

        currentAmount -= (coins[i].data?.content.fields.balance as number);
      }

      const txb = new TransactionBlock();

      const { newCoin, newBalance } = joinCoins(
        txb,
        coinsForAllocate,
        packageId,
        packageName
      );

      const coinForAllocate = amount === newBalance
        ? newCoin
        : txb.moveCall({
          target: '0x2::token::split',
          typeArguments: [`${packageId}::${packageName}::${packageName.toUpperCase()}`],
          arguments: [
            txb.object(newCoin),
            txb.pure.u64(amount),
          ],
        });

      txb.moveCall({
        target: `${packageId}::${packageName}::allocate`,
        typeArguments: [`${packageId}::${packageName}::${packageName.toUpperCase()}`],
        arguments: [
          txb.object(treasuryCap),
          txb.object(tokenPolicy),
          txb.object(coinForAllocate),
          txb.pure.address(recipientAddresses),
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
      queryClient.invalidateQueries({
        queryKey: ['current-stable-coins-balances'],
      });
      queryClient.invalidateQueries({
        queryKey: ['current-stable-coin-balance'],
      });
    },
  });
};
