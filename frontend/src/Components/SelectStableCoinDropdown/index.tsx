'use client';

import React, { FC, HTMLAttributes, useMemo } from 'react';
import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'qs';
import { twMerge } from 'tailwind-merge';

import ChevronIcon from '@/../public/images/chevron.svg?jsx';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Loader } from '@/Components/Loader';

import { useStableCoinsList } from '@/hooks/useStableCoinsList';

export interface SelectStableCoinDropdownProps extends HTMLAttributes<HTMLDivElement> {}

export const SelectStableCoinDropdown: FC<SelectStableCoinDropdownProps> = ({ className, ...props }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const autoConnectionStatus = useAutoConnectWallet();
  const account = useCurrentAccount();
  const {
    data,
    isLoading: isStableCoinsListLoading,
  } = useStableCoinsList(account?.address);

  const { coins: stableCoins = [] } = data || {};

  const isLoading = useMemo(
    () => autoConnectionStatus === 'idle',
    [autoConnectionStatus]
  );
  const isRedirecting = useMemo(
    () => autoConnectionStatus === 'attempted' && !account?.address,
    [autoConnectionStatus, account?.address]
  );
  const currentStableCoin = useMemo(
    () => stableCoins.find(({ id }) => id === searchParams.get('txid')),
    [searchParams, stableCoins]
  );

  return (
    <div
      className={twMerge('', className)}
      {...props}
    >
      {
        isLoading || isRedirecting || isStableCoinsListLoading
          ? (
            <Loader className="h-8" />
          )
          : (
            <Menu
              menuButton={
                <MenuButton>
                  <Button view={BUTTON_VIEWS.secondary} className="px-5 py-3">
                    {'['}
                    {currentStableCoin?.name}
                    {']'}
                    {' '}
                    {currentStableCoin?.tokenName}
                    <ChevronIcon className="ml-2" />
                  </Button>
                </MenuButton>
              }
              transition
              menuClassName="!mt-4 !p-0 overflow-hidden"
              onItemClick={({ value: txid }) => router.push(
                `${pathname}?${qs.stringify({
                  ...Object.fromEntries(searchParams.entries()),
                  txid,
                })}`
              )}
            >
              {
                stableCoins.map(({ id, name, tokenName }) => (
                  <MenuItem
                    key={id}
                    value={id}
                    className="block w-full px-4 py-2 hover:bg-actionPrimary hover:bg-opacity-30 cursor-pointer"
                  >
                    {'['}
                    {name}
                    {']'}
                    {' '}
                    {tokenName}
                  </MenuItem>
                ))
              }
            </Menu>
          )
      }
    </div>
  );
};
