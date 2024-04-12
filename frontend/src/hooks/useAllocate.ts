import { useSignAndExecuteTransactionBlock, useSuiClient } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiSignAndExecuteTransactionBlockOutput } from '@mysten/wallet-standard';
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';

import { useStableCoinEvents } from './useStableCoinEvents';
import { useBuildTransaction } from './useBuildTransaction';
import { getAllOwnedObjects } from './useCurrentBalance';
import { StableCoin } from './useStableCoinsList';
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
      cashCap,
      packageId,
      treasuryCap,
      tokenPolicy,
      tokenSupply,
      amount,
    }: {
      senderAddresses: string,
      recipientAddresses: string,
      packageName: string,
      cashCap: string;
      packageId: string,
      treasuryCap: string,
      tokenPolicy: string,
      tokenSupply: string,
      amount: number,
    }): Promise<SuiSignAndExecuteTransactionBlockOutput> => {
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
          cashCap ? txb.object(cashCap) : txb.object(treasuryCap),
          txb.object(tokenPolicy),
          txb.object(coinForAllocate),
          txb.pure.address(recipientAddresses),
        ],
      });

      await buildTransaction.mutateAsync(txb);

      const data = await signAndExecuteTransactionBlock.mutateAsync({
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
      queryClient.invalidateQueries({
        queryKey: ['current-allocated-amount-to-account', recipientAddresses],
      });
      queryClient.invalidateQueries({
        queryKey: ['current-allocated', `$${packageName}`],
      });
      queryClient.invalidateQueries({
        queryKey: ['last-allocated-date-to-account', recipientAddresses],
      });

      return data;
    },
  });
};

export const useCurrentAllocated = (
  stableCoin?: StableCoin,
  excludeWalletAddress?: string[],
  queryOption?: Omit<UseQueryOptions<number, Error, number>, 'queryKey'>
) => {
  const stableCoinEvents = useStableCoinEvents(stableCoin);

  return useQuery<number>({
    ...queryOption,
    queryKey: ['current-allocated', stableCoin?.ticker, stableCoinEvents.data],
    queryFn: async () => (
      stableCoin && stableCoinEvents.data
        ? stableCoinEvents.data
          .filter(({ parsedJson }) => (
            parsedJson.recipient
              && (excludeWalletAddress ? !excludeWalletAddress.includes(parsedJson.recipient) : true)
          ))
          .map(({ parsedJson: { amount } }) => parseFloat(amount))
          .reduce((accumulator, next) => accumulator + next)
        : Promise.resolve(0)
    ),
    enabled: !!stableCoinEvents.data,
  });
};

export const useCurrentAllocatedAmountToAccount = (walletAddress?: string, stableCoin?: StableCoin) => {
  const stableCoinEvents = useStableCoinEvents(stableCoin);

  return useQuery<number>({
    queryKey: ['current-allocated-amount-to-account', walletAddress, stableCoin?.ticker, stableCoinEvents.data],
    queryFn: async () => (
      walletAddress && stableCoin && stableCoinEvents.data
        ? stableCoinEvents.data
          .filter(({ parsedJson }) => parsedJson.recipient === walletAddress)
          .map(({ parsedJson: { amount } }) => parseFloat(amount))
          .reduce((accumulator, next) => accumulator + next)
        : Promise.resolve(0)
    ),
    enabled: !!stableCoinEvents.data,
  });
};

export const useLastAllocatedDateToAccount = (walletAddress?: string, stableCoin?: StableCoin) => {
  const stableCoinEvents = useStableCoinEvents(stableCoin);

  return useQuery<Date | undefined>({
    queryKey: ['last-allocated-date-to-account', walletAddress, stableCoin?.ticker, stableCoinEvents.data],
    queryFn: async () => {
      const lastTimeStamp = walletAddress && stableCoin && stableCoinEvents.data
        ? stableCoinEvents.data
          .filter(({ parsedJson }) => parsedJson.recipient === walletAddress)
          .map(({ timestampMs }) => parseInt(timestampMs))
          .sort()
          .at(-1)
        : 0;

      return lastTimeStamp ? new Date(lastTimeStamp) : undefined;
    },
    enabled: !!stableCoinEvents.data,
  });
};
