import { useSuiClient } from '@mysten/dapp-kit';
import { GetOwnedObjectsParams, SuiClient } from '@mysten/sui.js/client';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import convertSuiBalanceStringToNumber from '../utils/convertSuiBalanceStringToNumber';

import { StableCoin } from './useStableCoinsList';

export interface StableCoinBalanceObject {
  data: {
    objectId: string,
    digest: string,
    content: {
      dataType: 'moveObject',
      type: string,
      hasPublicTransfer: boolean,
      fields: {
        balance: string | number,
        id: {
          id: string,
        },
      },
    },
  },
}

const getCurrentBalance = async (suiClient: SuiClient, accountAddress: string): Promise<number> => {
  const { totalBalance } = await suiClient.getBalance({
    owner: accountAddress,
  });

  return convertSuiBalanceStringToNumber(totalBalance);
};

export const useCurrentSuiBalance = (
  address: string,
  queryOption?: Omit<UndefinedInitialDataOptions<number, Error, number>, 'queryKey'>
) => {
  const suiClient = useSuiClient();

  return useQuery<number>({
    ...queryOption,
    queryKey: ['current-sui-balance', address],
    queryFn: () => suiClient && address
      ? getCurrentBalance(suiClient, address)
      : Promise.resolve(0),
  });
};

export const useCurrentStableCoinBalance = (walletAddress?: string, stableCoin?: StableCoin) => {
  const suiClient = useSuiClient();

  return useQuery<number>({
    queryKey: ['current-stable-coin-balance', walletAddress, stableCoin?.ticker],
    queryFn: async () => (
      walletAddress && stableCoin
        ? (await getAllOwnedObjects(suiClient, { owner: walletAddress }))
          .filter(
            obj => obj.data?.content?.dataType === 'moveObject'
              && obj.data?.content?.type == `0x2::token::Token<${stableCoin.deploy_addresses.packageId}::${stableCoin.package_name}::${stableCoin.package_name.toUpperCase()}>`
          )
          .map(coin => parseFloat(coin.data.content.fields.balance as string))
          .reduce((sum, next) => sum + next)
        : Promise.resolve(0)
    ),
  });
};

export async function getAllOwnedObjects(
  suiClient: SuiClient,
  {
    owner,
    cursor,
  }: GetOwnedObjectsParams
): Promise<StableCoinBalanceObject[]> {
  const { data, hasNextPage, nextCursor } = await suiClient.getOwnedObjects({
    owner,
    cursor,
    options: {
      showContent: true,
    },
  });

  return [
    ...data as unknown as StableCoinBalanceObject[],
    ...[
      hasNextPage && nextCursor
        ? await getAllOwnedObjects(suiClient, { owner, cursor: nextCursor })
        : [],
    ],
  ].flat();
}
