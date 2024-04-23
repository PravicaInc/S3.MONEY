'use client';

import { useEffect, useMemo } from 'react';
import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { useRouter, useSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import { Loader } from '@/Components/Loader';

import { RelationsTable } from '@/app/dashboard/relations/components/RelationsTable';

import { PAGES_URLS } from '@/utils/const';

import { useRelationsList } from '@/hooks/useRelations';
import { useStableCoinsList } from '@/hooks/useStableCoinsList';

// import { AddressesByHoldings } from './components/AddressesByHoldings';
import { AllocationRatio } from './components/AllocationRatio';
import { StableCoinDetails } from './components/StableCoinDetails';
// import { TransactionVolume } from './components/TransactionVolume';

export default function DashboardOverviewPage() {
  const account = useCurrentAccount();
  const autoConnectionStatus = useAutoConnectWallet();
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    data: stableCoinsList,
    isLoading: isStableCoinsListLoading,
    isFetching: isStableCoinsListFetching,
  } = useStableCoinsList(account?.address);

  const { coins: stableCoins = [] } = stableCoinsList || {};

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

  const {
    data: relationsList,
    isLoading: isRelationsListLoading,
    isFetching: isRelationsListFetching,
  } = useRelationsList(currentStableCoin?.deploy_addresses.packageId);

  useEffect(
    () => {
      if (!isLoading && !isRedirecting && !isStableCoinsListFetching && !currentStableCoin) {
        router.replace(PAGES_URLS.home);
      }
    },
    [isLoading, isRedirecting, isStableCoinsListFetching, currentStableCoin, router]
  );

  return (
    <div
      className={twMerge(
        'max-w-screen-2xl mx-auto p-8 h-full',
        (
          isLoading
            || isRedirecting
            || isStableCoinsListLoading
            || !currentStableCoin
        )
          && 'flex items-center justify-center h-full'
      )}
    >
      {
        !(isLoading || isRedirecting || isStableCoinsListLoading || isRelationsListLoading)
          && currentStableCoin
          && relationsList
          ? (
            <>
              <div className="grid grid-cols-2 gap-6">
                <AllocationRatio
                  stableCoinItem={currentStableCoin}
                />
                <StableCoinDetails
                  stableCoinItem={currentStableCoin}
                  className="flex flex-col justify-between"
                />
              </div>
              {/* TODO: Add real data */}
              {/* <TransactionVolume
                stableCoinItem={currentStableCoin}
                className="mt-6"
              />
              <AddressesByHoldings
                stableCoinItem={currentStableCoin}
                className="mt-6"
              /> */}
              <RelationsTable
                className="mt-6"
                relationsList={relationsList}
                currentStableCoin={currentStableCoin}
                isFetching={isRelationsListFetching}
              />
            </>
          )
          : (
            <div className="w-full h-full flex items-center justify-center">
              <Loader className="h-8" />
            </div>
          )
      }
    </div>
  );
}
