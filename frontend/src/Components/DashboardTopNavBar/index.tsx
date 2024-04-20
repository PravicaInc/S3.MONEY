'use client';

import { FC, HTMLAttributes, useMemo } from 'react';
import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { useSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import { Loader } from '@/Components/Loader';
import { LogoutButton } from '@/Components/LogoutButton';
import { SelectStableCoinDropdown } from '@/Components/SelectStableCoinDropdown';

import { useHasUserAccessToApp } from '@/hooks/useHasUserAccessToApp';
import { useShortAccountAddress } from '@/hooks/useShortAccountAddress';

export const DashboardTopNavBar: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  const shortAccountAddress = useShortAccountAddress();
  const searchParams = useSearchParams();
  const autoConnectionStatus = useAutoConnectWallet();
  const account = useCurrentAccount();
  const {
    data: hasUserAccessToApp,
    isPending: isHasUserAccessToAppPending,
    isFetching: isHasUserAccessToAppFetching,
  } = useHasUserAccessToApp(account?.address);

  const isLoading = useMemo(
    () => autoConnectionStatus === 'idle' || isHasUserAccessToAppPending || isHasUserAccessToAppFetching,
    [autoConnectionStatus, isHasUserAccessToAppPending, isHasUserAccessToAppFetching]
  );
  const isRedirecting = useMemo(
    () => (autoConnectionStatus === 'attempted' && !account?.address) || !hasUserAccessToApp,
    [autoConnectionStatus, account?.address, hasUserAccessToApp]
  );

  return (
    <div
      className={twMerge(
        'flex items-center justify-end gap-2 px-6 h-20 border-b border-borderPrimary bg-white',
        className
      )}
      {...props}
    >
      {
        (isLoading || isRedirecting) && (
          <Loader className="h-8" />
        )
      }
      {
        searchParams.get('txid') && hasUserAccessToApp && (
          <SelectStableCoinDropdown />
        )
      }
      {
        shortAccountAddress && hasUserAccessToApp && (
          <LogoutButton />
        )
      }
    </div>
  );
};
