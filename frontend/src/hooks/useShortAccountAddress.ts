import { useMemo } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';

import { getShortAccountAddress } from '@/utils/string_formats';

export function useShortAccountAddress() {
  const account = useCurrentAccount();

  const shortAccountAddress = useMemo(
    () => account?.address
      ? getShortAccountAddress(account?.address)
      : null,
    [account]
  );

  return shortAccountAddress;
}
