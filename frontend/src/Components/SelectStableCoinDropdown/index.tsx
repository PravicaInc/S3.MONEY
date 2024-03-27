'use client';

import React, { FC, HTMLAttributes, useMemo } from 'react';
import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'qs';
import { twMerge } from 'tailwind-merge';

import ChevronIcon from '@/../public/images/chevron.svg?jsx';

import { Loader } from '@/Components/Loader';

import { StableCoin, useStableCoinsList } from '@/hooks/useStableCoinsList';

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
    () => stableCoins.find(({ txid }) => txid === searchParams.get('txid')),
    [searchParams, stableCoins]
  );

  return (
    <div
      className={twMerge('', className)}
      {...props}
    >
      {
        !(isLoading || isRedirecting || isStableCoinsListLoading) && currentStableCoin
          ? (
            <Menu
              menuButton={
                <MenuButton
                  className="
                    border border-borderPrimary rounded-[10px]
                    h-10 px-4 flex items-center justify-between gap-2
                    text-grayText font-medium text-sm
                    transition
                    hover:bg-actionPrimary hover:bg-opacity-5 hover:border-actionSecondary
                  "
                >
                  {getStableCoinName(currentStableCoin)}
                  <ChevronIcon className="[&>path]:stroke-grayText" />
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
                stableCoins.map(({ txid, name, ticker }) => (
                  <MenuItem
                    key={txid}
                    value={txid}
                    className="
                      block w-full px-4 py-3 cursor-pointer
                      text-grayText font-medium text-sm
                      hover:bg-actionPrimary hover:bg-opacity-10
                    "
                  >
                    {getStableCoinName({ ticker, name })}
                  </MenuItem>
                ))
              }
            </Menu>
          )
          : (
            <Loader className="h-8" />
          )
      }
    </div>
  );

  function getStableCoinName({ ticker, name }: Pick<StableCoin, 'ticker' | 'name'>) {
    return `[${ticker}] ${name}`;
  }
};