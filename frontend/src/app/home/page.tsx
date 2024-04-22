'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import BackgroundModalDecorativeFullIcon from '@/../public/images/background_modal_decorative_full.svg?jsx';
import PlusIcon from '@/../public/images/plus.svg?jsx';
import SearchIcon from '@/../public/images/search.svg?jsx';

import { Footer } from '@/Components/Footer';
import { Button } from '@/Components/Form/Button';
import { SimpleInput } from '@/Components/Form/Input';
import { Loader } from '@/Components/Loader';
import { LogoutButton } from '@/Components/LogoutButton';

import { PAGES_URLS } from '@/utils/const';

import { useHasUserAccessToApp } from '@/hooks/useHasUserAccessToApp';
import { useShortAccountAddress } from '@/hooks/useShortAccountAddress';
import { StableCoin, useStableCoinsList } from '@/hooks/useStableCoinsList';

import { StableCoinItem } from './components/StableCoinItem';

export default function HomePage() {
  const shortAccountAddress = useShortAccountAddress();
  const autoConnectionStatus = useAutoConnectWallet();
  const account = useCurrentAccount();
  const {
    data,
    isLoading: isStableCoinsListLoading,
    isFetching: isStableCoinsListFetching,
  } = useStableCoinsList(account?.address);
  const {
    data: hasUserAccessToApp,
    isPending: isHasUserAccessToAppPending,
    isFetching: isHasUserAccessToAppFetching,
  } = useHasUserAccessToApp(account?.address);

  const [searchValue, setSearchValue] = useState<string>('');

  const { coins: stableCoins = [] } = data || {};

  const filteredStableCoins = useMemo(
    () => stableCoins.filter(coin => stableCoinMatchesSearch(coin, searchValue)),
    [stableCoins, searchValue]
  );
  const isLoading = useMemo(
    () => autoConnectionStatus === 'idle' || isHasUserAccessToAppPending || isHasUserAccessToAppFetching,
    [autoConnectionStatus, isHasUserAccessToAppPending, isHasUserAccessToAppFetching]
  );
  const isRedirecting = useMemo(
    () => (autoConnectionStatus === 'attempted' && !account?.address) || !hasUserAccessToApp,
    [autoConnectionStatus, account?.address, hasUserAccessToApp]
  );

  const changeSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setSearchValue(newValue);
  };

  return (
    <>
      <div
        className={twMerge(
          'flex items-center gap-2 px-6 min-h-20 border-b border-borderPrimary bg-white',
          isLoading || isRedirecting || (stableCoins.length === 0 && !isStableCoinsListLoading)
            ? 'justify-end'
            : 'justify-between'
        )}
      >
        {
          shortAccountAddress && hasUserAccessToApp && (
            isStableCoinsListLoading
              ? (
                <Loader className="h-8" />
              )
              : !!stableCoins.length && (
                <SimpleInput
                  className="w-[460px] text-sm py-[9px]"
                  value={searchValue}
                  onChange={changeSearchValue}
                  placeholder="Search..."
                  icon={<SearchIcon />}
                />
              )
          )
        }
        {
          (isLoading || isRedirecting) && (
            <Loader className="h-8" />
          )
        }
        {
          shortAccountAddress && hasUserAccessToApp && (
            <LogoutButton />
          )
        }
      </div>
      <div className="overflow-auto h-full flex flex-col justify-between">
        {
          isLoading || isRedirecting || isStableCoinsListLoading || isStableCoinsListFetching
            ? (
              <div className="flex h-full items-center justify-center">
                <Loader className="h-10" />
              </div>
            )
            : (
              filteredStableCoins.length
                ? (
                  <div className="m-8 space-y-3">
                    {
                      filteredStableCoins.map(stableCoin => (
                        <StableCoinItem
                          key={stableCoin.txid}
                          stableCoinItem={stableCoin}
                        />
                      ))
                    }
                  </div>
                )
                : (
                  <div className="flex h-full items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="relative -mt-[200px] z-0">
                        <BackgroundModalDecorativeFullIcon />
                        <div
                          className="
                            w-12 h-12 rounded-[10px] border border-dawnPink
                            flex items-center justify-center
                            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          "
                        >
                          <SearchIcon className="[&>*]:stroke-pickledBluewood" />
                        </div>
                      </div>
                      <div className="relative z-10 -mt-[200px] flex flex-col items-center">
                        <p className="text-primary font-semibold">
                          No projects found
                        </p>
                        <p className="text-center text-riverBed text-sm mt-1">
                          You currently do not have any stablecoin created.
                          <br />
                          Please click “Create New Stablecoin” to create one
                        </p>
                        <Link href={PAGES_URLS.createStableCoin} className="rounded-xl mt-6">
                          <Button className="text-sm font-semibold h-[44px] w-[254px] flex items-center gap-[10px]">
                            <PlusIcon />
                            <span className="mt-[1px]">
                              Create New Stablecoin
                            </span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
            )
        }
        <Footer
          className="pb-7 pl-9 pr-[85px]"
        />
      </div>
    </>
  );

  function stableCoinMatchesSearch(stableCoin: StableCoin, search: string) {
    return stableCoin.ticker.toLowerCase().includes(search.toLowerCase())
      || stableCoin.name.toLowerCase().includes(search.toLowerCase());
  }
}
