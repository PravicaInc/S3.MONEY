'use client';

import { useMemo } from 'react';
import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';

import { Loader } from '@/Components/Loader';

import { useHasUserAccessToApp } from '@/hooks/useHasUserAccessToApp';

export default function AccessDeniedPage() {
  const autoConnectionStatus = useAutoConnectWallet();
  const account = useCurrentAccount();
  const { data: hasUserAccessToApp, isLoading: isHasUserAccessToAppLoading } = useHasUserAccessToApp(account?.address);

  const isLoading = useMemo(
    () => autoConnectionStatus === 'idle' || isHasUserAccessToAppLoading,
    [autoConnectionStatus, isHasUserAccessToAppLoading]
  );
  const isRedirecting = useMemo(
    () => autoConnectionStatus === 'attempted' && account?.address && hasUserAccessToApp,
    [autoConnectionStatus, account?.address, hasUserAccessToApp]
  );

  return (
    <div className="flex flex-col min-h-screen">
      {
        isLoading || isRedirecting
          ? (
            <Loader />
          )
          : 'AccessDenied'
      }
    </div>
  );
}
