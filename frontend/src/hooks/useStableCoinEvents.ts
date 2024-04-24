import { useSuiClient } from '@mysten/dapp-kit';
import { QueryEventsParams, SuiClient } from '@mysten/sui.js/client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { StableCoin } from './useStableCoinsList';

export interface StableCoinEventObject {
  id: {
    txDigest: string;
    eventSeq: string;
  };
  packageId: string;
  transactionModule: string;
  sender: string;
  type: string;
  parsedJson: {
    amount: string;
    address?: string;
    recipient?: string;
    sender?: string;
  }
  bcs: string;
  timestampMs: string;
}

export const useStableCoinEvents = (
  stableCoin?: StableCoin,
  queryOption?: Omit<UseQueryOptions<StableCoinEventObject[], Error, StableCoinEventObject[]>, 'queryKey'>
) => {
  const suiClient = useSuiClient();

  return useQuery<StableCoinEventObject[]>({
    queryKey: ['use-stable-coin-events', stableCoin?.deploy_addresses.packageId],
    queryFn: async () => (
      stableCoin
        ? (await getAllEvents(suiClient, {
          query: {
            MoveModule: {
              package: stableCoin?.deploy_addresses.packageId,
              module: stableCoin.package_name,
            },
          },
        }))
        : Promise.resolve([])
    ),
    ...queryOption,
  });
};

export async function getAllEvents(
  suiClient: SuiClient,
  {
    query,
    cursor,
  }: QueryEventsParams
): Promise<StableCoinEventObject[]> {
  const { data, hasNextPage, nextCursor } = await suiClient.queryEvents({
    query,
    cursor,
  });

  return [
    ...data as unknown as StableCoinEventObject[],
    ...[
      hasNextPage && nextCursor
        ? await getAllEvents(suiClient, { query, cursor: nextCursor })
        : [],
    ],
  ].flat();
}
