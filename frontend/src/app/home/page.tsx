'use client';

import { useMemo } from 'react';
import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';

import { Loader } from '@/Components/Loader';

export default function HomePage() {
  const autoConnectionStatus = useAutoConnectWallet();
  const account = useCurrentAccount();

  const isLoading = useMemo(
    () => autoConnectionStatus === 'idle',
    [autoConnectionStatus]
  );
  const isRedirecting = useMemo(
    () => autoConnectionStatus === 'attempted' && !account?.address,
    [autoConnectionStatus, account?.address]
  );

  return (
    <div className="flex items-center justify-center h-full">
      {(isLoading || isRedirecting) && (
        <Loader className="h-20" />
      )}
      {!!account?.address && (
        <>
          Select Stablecoin
        </>
      )}
    </div>
  );
}
