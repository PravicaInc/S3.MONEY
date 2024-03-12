import { useMemo } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';

export function useShortAccountAddress() {
  const account = useCurrentAccount();

  const shortAccountAddress = useMemo(
    () => account?.address
      ? `${account.address.substring(0, 4)}...${account.address.substring(account.address.length - 4)}`
      : null,
    [account]
  );

  return shortAccountAddress;
}
