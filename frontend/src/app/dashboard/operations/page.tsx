'use client';

import { useEffect, useMemo } from 'react';
import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { useRouter, useSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import BurnIcon from '@/../public/images/burn_icon.svg?jsx';
import CashInIcon from '@/../public/images/cash_in_icon.svg?jsx';
import MintIcon from '@/../public/images/mint_icon.svg?jsx';

import { Loader } from '@/Components/Loader';

import { PAGES_URLS } from '@/utils/const';

import { useStableCoinsList } from '@/hooks/useStableCoinsList';

import { FreezeAddressForm } from './components/FreezeAddressForm';
import { PlayPauseForm } from './components/PlayPauseForm';

export default function DashboardOperationsPage() {
  const account = useCurrentAccount();
  const autoConnectionStatus = useAutoConnectWallet();
  const searchParams = useSearchParams();
  const router = useRouter();
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

  useEffect(
    () => {
      if (!isLoading && !isRedirecting && !isStableCoinsListLoading && !currentStableCoin) {
        router.replace(PAGES_URLS.home);
      }
    },
    [isLoading, isRedirecting, isStableCoinsListLoading, currentStableCoin, router]
  );

  const actions = [
    {
      title: 'Mint',
      icon: <MintIcon />,
      description: 'Issuers can effortlessly create new tokens, increasing the total supply of the stablecoin.',
    },
    {
      title: 'Cash In',
      icon: <CashInIcon />,
      description: 'Issuers can allocate some authorized tokens to the circulation for public.',
    },
    {
      title: 'Burn',
      icon: <BurnIcon />,
      description: `
        The platform allows issuers to reduce the overall token supply by 'burning' or destroying tokens.
      `,
    },
  ];

  return (
    <div
      className={twMerge(
        'max-w-screen-2xl mx-auto p-10',
        (isLoading || isRedirecting || isStableCoinsListLoading || !currentStableCoin)
          && 'flex items-center justify-center h-full'
      )}
    >
      {
        !(isLoading || isRedirecting || isStableCoinsListLoading) && currentStableCoin
          ? (
            <>
              <div className="grid grid-cols-2 gap-10">
                <PlayPauseForm
                  stableCoin={currentStableCoin}
                  className="py-4 px-6 border border-borderPrimary rounded-xl"
                />
                <FreezeAddressForm
                  stableCoin={currentStableCoin}
                  className="py-4 px-6 border border-borderPrimary rounded-xl"
                />
              </div>
              <div className="grid grid-cols-3 gap-8 mt-6">
                {actions.map(({ title, icon, description }) => (
                  <div
                    key={title}
                    className="border border-borderPrimary rounded-[10px] bg-white p-6"
                  >
                    <div
                      className="bg-deepPeach w-10 h-10 flex items-center justify-center rounded-full shadow-operationIcon"
                    >
                      {icon}
                    </div>
                    <p className="text-primary text-lg font-semibold mt-5">
                      {title}
                    </p>
                    <p className="text-grayText text-sm mt-2">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )
          : (
            <Loader className="h-8" />
          )
      }
    </div>
  );
}
