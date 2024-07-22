import { useMemo } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';

import { getShortAccountAddress } from '../utils/string_formats.ts';

export function useShortAccountAddress() {
  const account = useCurrentAccount();

  return useMemo(() => (account?.address ? getShortAccountAddress(account?.address) : null), [account]);
}
