import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { useCurrentStableCoinBalance } from './useCurrentBalance';
import { StableCoin } from './useStableCoinsList';

export const useHasUserAccessToApp = (
  walletAddress?: string,
  queryOption?: Omit<UseQueryOptions<boolean, Error, boolean>, 'queryKey'>
) => {
  const hasAccessStablecoin = !!(
    process.env.NEXT_PUBLIC_ACCESS_STABLECOIN_PACKAGE_ID
      && process.env.NEXT_PUBLIC_ACCESS_STABLECOIN_PACKAGE_NAME
      && process.env.NEXT_PUBLIC_ACCESS_STABLECOIN_TICKER
  );
  const stableCoinBalance = useCurrentStableCoinBalance(
    walletAddress,
    {
      deploy_addresses: {
        packageId: process.env.NEXT_PUBLIC_ACCESS_STABLECOIN_PACKAGE_ID,
      },
      package_name: process.env.NEXT_PUBLIC_ACCESS_STABLECOIN_PACKAGE_NAME,
      ticker: process.env.NEXT_PUBLIC_ACCESS_STABLECOIN_TICKER,
    } as StableCoin
  );

  return useQuery<boolean>({
    ...queryOption,
    queryKey: ['has-user-access-to-app', walletAddress, stableCoinBalance.data],
    queryFn: async () => (
      hasAccessStablecoin
        ? (
          walletAddress
            ? !!stableCoinBalance.data
            : Promise.resolve(false)
        )
        : Promise.resolve(true)
    ),
    enabled: hasAccessStablecoin
      ? stableCoinBalance.data !== undefined
      : true,
  });
};
