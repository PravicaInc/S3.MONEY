import React, { FC, HTMLAttributes, ReactNode, useMemo } from 'react';
import { useSuiClientContext } from '@mysten/dapp-kit';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import StablecoinBgIcon1 from '@/../public/images/stablecoin_bg_1.svg?jsx';
import StablecoinBgIcon2 from '@/../public/images/stablecoin_bg_2.svg?jsx';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Loader } from '@/Components/Loader';

import { PAGES_URLS } from '@/utils/const';
import { numberFormat } from '@/utils/string_formats';

import { useIsSystemPaused } from '@/hooks/usePlayPauseSystem';
import { StableCoin } from '@/hooks/useStableCoinsList';
import { useStableCoinCurrentSupply } from '@/hooks/useStableCoinSupply';

export const STABLE_COIN_ITEM_BACKGROUNDS = {
  1: <StablecoinBgIcon1 className="absolute right-0 -bottom-4 z-0" />,
  2: <StablecoinBgIcon2 className="absolute right-0 -bottom-4 z-0" />,
};

export interface StableCoinItemProps extends HTMLAttributes<HTMLDivElement> {
  stableCoinItem: StableCoin;
  isSelected?: boolean;
  bg?: ReactNode;
}

export const StableCoinItem: FC<StableCoinItemProps> = ({
  stableCoinItem,
  className,
  bg = STABLE_COIN_ITEM_BACKGROUNDS[2],
  ...props
}) => {
  const {
    txid,
    name,
    ticker,
    icon,
  } = stableCoinItem;

  const pathname = usePathname();
  const suiClientContext = useSuiClientContext();

  const {
    data: stableCoinCurrentSupply = 0,
    isLoading: isLoadingStableCoinCurrentSupply,
  } = useStableCoinCurrentSupply(
    stableCoinItem,
    {
      refetchOnWindowFocus: false,
    }
  );
  const { data: isPaused, isLoading: isPausedLoading } = useIsSystemPaused(
    stableCoinItem.deploy_addresses.pauser,
    {
      refetchOnWindowFocus: false,
    }
  );

  const manageLink = useMemo<string>(
    () => {
      if (pathname.indexOf(PAGES_URLS.relations) !== -1) {
        return PAGES_URLS.dashboardRelations;
      }

      return PAGES_URLS.dashboardOperations;
    },
    [pathname]
  );

  return (
    <div
      className={twMerge(
        'border border-borderPrimary p-4 bg-white rounded-2xl flex flex-col justify-between',
        className
      )}
      {...props}
    >
      <div>
        <p className="text-primary font-medium flex items-center justify-between">
          Contract Transaction
          <a
            href={`https://suiscan.xyz/${suiClientContext.network}/tx/${txid}`}
            target="_blank"
            rel="noreferrer"
            className="text-secondary underline"
          >
            {txid.substring(0, 5)}
          </a>
        </p>
        <div className="border border-borderPrimary rounded-lg overflow-hidden mt-4">
          <div
            className="flex items-center gap-2 py-2 px-4 bg-whiteLilac border-b border-borderPrimary relative z-10"
          >
            <div
              className="w-7 h-7 rounded-full bg-seashell bg-no-repeat bg-center bg-cover shrink-0"
              style={{
                backgroundImage: `url(${icon})`,
              }}
            />
            <p className="flex items-center gap-1 text-ebonyClay text-sm font-medium">
              <span className="">
                {name}
              </span>
              <span className="">
                (
                {ticker}
                )
              </span>
            </p>
          </div>
          {
            isLoadingStableCoinCurrentSupply || isPausedLoading
              ? (
                <div className="h-[176px] flex items-center justify-center">
                  <Loader className="h-10" />
                </div>
              )
              : (
                <div className="relative">
                  <p className="text-primary text-[40px] font-medium mx-4 mt-9">
                    {numberFormat(`${stableCoinCurrentSupply}`)}
                  </p>
                  <div
                    className={twMerge(
                      'mt-8 h-8 flex items-center justify-between mx-4 mb-4 px-4 rounded-md text-xs font-medium',
                      'relative z-10',
                      isPaused ? 'bg-mistyRose text-grapefruit' : 'bg-twilightBlue text-greenishBlue'
                    )}
                  >
                    {
                      isPaused
                        ? 'Paused'
                        : 'Active'
                    }
                    <div
                      className={twMerge(
                        'w-3 h-3 rounded-full',
                        isPaused ? 'bg-rubyRed' : 'bg-darkMintGreen'
                      )}
                    />
                  </div>
                  {bg}
                </div>
              )
          }
        </div>
      </div>
      <Link
        href={`${manageLink}?txid=${txid}`}
        className="rounded-xl block"
      >
        <Button
          view={BUTTON_VIEWS.secondary}
          className="mt-4 w-full h-[48px]"
        >
          Manage
        </Button>
      </Link>
    </div>
  );
};
