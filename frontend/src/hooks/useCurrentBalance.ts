import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { SuiClient } from '@mysten/sui.js/client';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import convertSuiBalanceStringToNumber from '@/utils/convertSuiBalanceStringToNumber';

const getCurrentBalance = async (suiClient: SuiClient, accountAddress: string): Promise<number> => {
  const { totalBalance } = await suiClient.getBalance({
    owner: accountAddress,
  });

  return convertSuiBalanceStringToNumber(totalBalance);
};

export const useCurrentBalance = (
  queryOption?: Omit<UndefinedInitialDataOptions<number, Error, number>, 'queryKey'>
) => {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();

  return useQuery<number>({
    ...queryOption,
    queryKey: ['current-balance', account?.address],
    queryFn: () => suiClient && account?.address
      ? getCurrentBalance(suiClient, account?.address)
      : Promise.resolve(0),
  });
};
