'use client';

import { useEffect, useMemo } from 'react';
import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { useRouter, useSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import { Loader } from '@/Components/Loader';
import { Tips } from '@/Components/Tips';

import { PAGES_URLS } from '@/utils/const';

import { useRelationsList } from '@/hooks/useRelations';
import { useStableCoinsList } from '@/hooks/useStableCoinsList';

import { RelationsTable } from './components/RelationsTable';

export default function DashboardOperationsPage() {
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
        'max-w-screen-2xl mx-auto p-8',
        (
          isLoading
            || isRedirecting
            || isStableCoinsListLoading
            || isRelationsListLoading
            || !currentStableCoin
            || !relationsList
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
              <RelationsTable
                relationsList={relationsList}
                currentStableCoin={currentStableCoin}
                isFetching={isRelationsListFetching}
              />
              <Tips
                title="Related Wallets"
                tipsList={[
                  'You can initiate and monitor transactions from each of your related wallets.',
                  'You can edit the names of your related wallets to easily identify their function.',
                  'You can always add new relationships by naming them and providing the wallet address.',
                ]}
                className="mt-6"
              />
            </>
          )
          : (
            <Loader className="h-8" />
          )
      }
    </div>
  );
}
