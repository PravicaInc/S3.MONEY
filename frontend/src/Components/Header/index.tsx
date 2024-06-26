'use client';

import { FC, HTMLAttributes, useMemo } from 'react';
import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { twMerge } from 'tailwind-merge';

import { Loader } from '@/Components/Loader';
import { Logo } from '@/Components/Logo';
import { LogoutButton } from '@/Components/LogoutButton';

import { useShortAccountAddress } from '@/hooks/useShortAccountAddress';

export const Header: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
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
        'min-h-20 px-8 border-b border-borderPrimary bg-white flex items-center justify-center',
        className
      )}
      {...props}
    >
      <div
        data-testid="header"
        className="flex items-center justify-between max-w-screen-2xl mx-auto h-full w-full"
      >
        <Logo />
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
    </div>
  );
};
