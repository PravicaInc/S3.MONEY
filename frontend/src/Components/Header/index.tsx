'use client';

import { FC, HTMLAttributes, useMemo } from 'react';
import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import LogoIcon from '@/../public/images/logo.svg?jsx';

import { Loader } from '@/Components/Loader';
import { LogoutButton } from '@/Components/LogoutButton';

import { PAGES_URLS } from '@/utils/const';

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
        <Link href={PAGES_URLS.home}>
          <LogoIcon />
        </Link>
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
