'use client';

import { ReactNode, useEffect, useMemo } from 'react';
import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { UrlObject } from 'url';

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
    isFetching: isStableCoinsListFetching,
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
  const {
    showPlayPauseSystemBlock,
    showFreezeBlock,
    showBurnBlock,
    showCashInBlock,
    showMintBlock,
  } = useMemo(
    () => ({
      showPlayPauseSystemBlock: currentStableCoin?.address_roles.includes('pause'),
      showFreezeBlock: currentStableCoin?.address_roles.includes('freeze'),
      showMintBlock: currentStableCoin?.address_roles.includes('mint'),
      showCashInBlock: currentStableCoin?.address_roles.includes('cashIn'),
      showBurnBlock: currentStableCoin?.address_roles.includes('burn'),
    }),
    [currentStableCoin]
  );
  const actions = useMemo(
    () => [
      ...[
        showMintBlock
          ? {
            title: 'Mint',
            icon: <MintIcon />,
            description: 'Issuers can effortlessly create new tokens, increasing the total supply of the stablecoin.',
            link: {
              pathname: PAGES_URLS.dashboardOperationsMint,
              query: Object.fromEntries(searchParams.entries()),
            },
          }
          : [],
      ],
      ...[
        showCashInBlock
          ? {
            title: 'Cash In',
            icon: <CashInIcon />,
            description: 'Issuers can allocate some authorized tokens to the circulation for public.',
            link: {
              pathname: PAGES_URLS.dashboardOperationsCashIn,
              query: Object.fromEntries(searchParams.entries()),
            },
          }
          : [],
      ],
      ...[
        showBurnBlock
          ? {
            title: 'Burn',
            icon: <BurnIcon />,
            description: `
              The platform allows issuers to reduce the overall token supply by 'burning' or destroying tokens.
            `,
            link: {
              pathname: PAGES_URLS.dashboardOperationsBurn,
              query: Object.fromEntries(searchParams.entries()),
            },
          }
          : [],
      ],
    ].flat() as {
      title: string,
      icon: ReactNode,
      description: string,
      link: string | UrlObject,
    }[],
    [showBurnBlock, showCashInBlock, showMintBlock, searchParams]
  );

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
        (isLoading || isRedirecting || isStableCoinsListLoading || !currentStableCoin)
          && 'flex items-center justify-center h-full'
      )}
    >
      {
        !(isLoading || isRedirecting || isStableCoinsListLoading) && currentStableCoin
          ? (
            <>
              <div
                className={twMerge(
                  'grid gap-10',
                  (showPlayPauseSystemBlock || showFreezeBlock) && 'mb-6',
                  showPlayPauseSystemBlock && showFreezeBlock
                    ? 'grid-cols-2'
                    : 'grid-cols-1'
                )}
              >
                {
                  showPlayPauseSystemBlock && (
                    <PlayPauseForm
                      stableCoin={currentStableCoin}
                      className="py-4 px-6 border border-borderPrimary rounded-xl"
                    />
                  )
                }
                {
                  showFreezeBlock && (
                    <FreezeAddressForm
                      stableCoin={currentStableCoin}
                      className="py-4 px-6 border border-borderPrimary rounded-xl"
                    />
                  )
                }
              </div>
              <div
                className={twMerge(
                  'grid gap-8',
                  actions.length === 1 && 'grid-cols-1',
                  actions.length === 2 && 'grid-cols-2',
                  actions.length === 3 && 'grid-cols-3'
                )}
              >
                {actions.map(({ title, icon, description, link }) => (
                  <Link
                    key={title}
                    className="border border-borderPrimary rounded-[10px] bg-white p-6"
                    href={link}
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
                  </Link>
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
