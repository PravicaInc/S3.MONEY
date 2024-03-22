'use client';

import { FC, HTMLAttributes, useMemo } from 'react';
import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { twMerge } from 'tailwind-merge';

import { Loader } from '@/Components/Loader';
import { LogoutButton } from '@/Components/LogoutButton';
import { SelectStableCoinDropdown } from '@/Components/SelectStableCoinDropdown';

import { useShortAccountAddress } from '@/hooks/useShortAccountAddress';

export const DashboardTopNavBar: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  const autoConnectionStatus = useAutoConnectWallet();
  const account = useCurrentAccount();
  const shortAccountAddress = useShortAccountAddress();

  const isLoading = useMemo(
    () => autoConnectionStatus === 'idle',
    [autoConnectionStatus]
  );
  const isRedirecting = useMemo(
    () => autoConnectionStatus === 'attempted' && !account?.address,
    [autoConnectionStatus, account?.address]
  );

  return (
    <div
      className={twMerge(
        'flex items-center justify-between p-6 h-24 border-b border-borderPrimary bg-white',
        className
      )}
      {...props}
    >
      <SelectStableCoinDropdown />
      {
        (isLoading || isRedirecting) && (
          <Loader className="h-8" />
        )
      }
      {
        shortAccountAddress && (
          <LogoutButton />
        )
      }
    </div>
  );
};
