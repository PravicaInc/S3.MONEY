'use client';

import React, { ChangeEvent, FC, HTMLAttributes, useCallback, useMemo, useState } from 'react';
import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import SearchIcon from '@/../public/images/search.svg?jsx';

import { Delimiter } from '@/Components/Delimiter';
import { Button } from '@/Components/Form/Button';
import { SimpleInput } from '@/Components/Form/Input';
import { Loader } from '@/Components/Loader';

import { PAGES_URLS } from '@/utils/const';

import { StableCoin, useStableCoinsList } from '@/hooks/useStableCoinsList';

import { StableCoinItem } from './components/StableCoinItem';

export interface SelectStableCoinFormProps extends HTMLAttributes<HTMLDivElement> {}

export const SelectStableCoinForm: FC<SelectStableCoinFormProps> = ({ className, ...props }) => {
  const autoConnectionStatus = useAutoConnectWallet();
  const account = useCurrentAccount();
  const {
    data,
    isLoading: isStableCoinsListLoading,
    isFetching: isStableCoinsListFetching,
  } = useStableCoinsList(account?.address);

  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedStableCoin, setSelectedStableCoin] = useState<StableCoin | null>();

  const { coins: stableCoins = [] } = data || {};

  const filteredStableCoins = useMemo(
    () => stableCoins.filter(coin => stableCoinMatchesSearch(coin, searchValue)),
    [stableCoins, searchValue]
  );
  const isLoading = useMemo(
    () => autoConnectionStatus === 'idle',
    [autoConnectionStatus]
  );
  const isRedirecting = useMemo(
    () => autoConnectionStatus === 'attempted' && !account?.address,
    [autoConnectionStatus, account?.address]
  );

  const changeSearchValue = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;

      setSearchValue(newValue);

      if (selectedStableCoin && !stableCoinMatchesSearch(selectedStableCoin, newValue)) {
        setSelectedStableCoin(null);
      }
    },
    [selectedStableCoin]
  );

  return (
    <div
      className={twMerge('bg-white shadow-stableCoinForm rounded-xl', className)}
      {...props}
    >
      <div className="px-6 py-5 flex items-center justify-between border-b border-borderPrimary">
        <span className="text-lg font-semibold text-primary">
          Select Stablecoin
        </span>
        {
          isLoading || isRedirecting
            ? (
              <Loader className="h-5" />
            )
            : (
              <Link href={PAGES_URLS.createStableCoin} className="rounded-xl">
                <Button className="text-sm font-semibold h-[37px] w-[153px]">
                  + New Stablecoin
                </Button>
              </Link>
            )
        }
      </div>
      {
        isLoading || isRedirecting || isStableCoinsListLoading || isStableCoinsListFetching
          ? (
            <div className="flex h-40 items-center justify-center">
              <Loader className="h-10" />
            </div>
          )
          : (
            <div className="p-6 space-y-6">
              <SimpleInput
                className="w-full"
                value={searchValue}
                onChange={changeSearchValue}
                placeholder="Search..."
                icon={<SearchIcon />}
              />
              <Delimiter />
              <div className="space-y-3 max-h-[410px] overflow-auto">
                {
                  filteredStableCoins.map(coin => (
                    <StableCoinItem
                      key={coin.id}
                      stableCoinItem={coin}
                      onClick={() => setSelectedStableCoin(coin)}
                      isSelected={selectedStableCoin?.id === coin.id}
                    />
                  ))
                }
              </div>
              <Button
                className="w-full h-[37px] text-sm font-semibold"
                disabled={!selectedStableCoin}
              >
                Manage Stablecoin
              </Button>
            </div>
          )
      }
    </div>
  );

  function stableCoinMatchesSearch(stableCoin: StableCoin, search: string) {
    return stableCoin.name.toLowerCase().includes(search.toLowerCase())
      || stableCoin.tokenName.toLowerCase().includes(search.toLowerCase());
  }
};
