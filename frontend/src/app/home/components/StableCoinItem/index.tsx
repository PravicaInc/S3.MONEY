import React, { FC, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import Link, { LinkProps } from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import defaultStableCoinIcon from '@/../public/images/default_stablecoin_icon.svg';

import { Delimiter } from '@/Components/Delimiter';
import { Loader } from '@/Components/Loader';

import { PAGES_URLS } from '@/utils/const';
import { numberFormat } from '@/utils/string_formats';

import { useCurrentAllocated } from '@/hooks/useAllocate';
import { useIsSystemPaused } from '@/hooks/usePlayPauseSystem';
import { StableCoin } from '@/hooks/useStableCoinsList';
import { useStableCoinCurrentSupply, useStableCoinMaxSupply } from '@/hooks/useStableCoinSupply';

export interface StableCoinItemProps extends Omit<LinkProps, 'href'> {
  stableCoinItem: StableCoin;
  className?: string;
}

export const StableCoinItem: FC<StableCoinItemProps> = ({
  stableCoinItem,
  className,
  ...props
}) => {
  const {
    txid,
    name,
    ticker,
    icon,
  } = stableCoinItem;

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    data: stableCoinCurrentSupply = 0,
    isLoading: isStableCoinCurrentSupplyLoading,
  } = useStableCoinCurrentSupply(
    stableCoinItem,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const {
    data: stableCoinMaxSupply = 0,
    isLoading: isStableCoinMaxSupplyLoading,
  } = useStableCoinMaxSupply(
    stableCoinItem,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const {
    data: stableCoinCurrentAllocated,
    isLoading: isStableCoinCurrentAllocatedLoading,
  } = useCurrentAllocated(
    stableCoinItem,
    [stableCoinItem.deploy_addresses.deployer],
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const { data: isPaused, isLoading: isPausedLoading } = useIsSystemPaused(
    stableCoinItem.deploy_addresses.pauser,
    {
      refetchOnMount: false,
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
    <Link
      {...props}
      href={{
        pathname: manageLink,
        query: {
          txid,
          ...(searchParams ? Object.fromEntries(searchParams.entries()) : {}),
        },
      }}
      className={twMerge(
        'block border border-borderPrimary bg-white rounded-[10px] shadow-button overflow-hidden',
        className
      )}
    >
      {
        isPausedLoading
          ? (
            <Skeleton className="w-full h-[7px] block rounded-none" inline />
          )
          : (
            <div
              className={twMerge(
                'h-[7px]',
                isPaused ? 'bg-rubyRed' : 'bg-freshGreen'
              )}
            />
          )
      }
      <div className="flex items-center justify-between pl-4 pr-5 pt-4">
        <div className="flex items-center gap-4">
          <div
            className="min-w-[60px] min-h-[60px] rounded-full bg-seashell bg-no-repeat bg-center bg-cover shrink-0"
            style={{
              backgroundImage: `url(${icon || defaultStableCoinIcon.src})`,
            }}
          />
          <div>
            <p className="text-primary text-[25px] font-semibold leading-[25px]">
              {ticker}
            </p>
            <p className="text-mistBlue text-sm">
              {name}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-primary text-[25px] font-semibold leading-[25px]">
            {
              isStableCoinCurrentSupplyLoading
                ? (
                  <Loader className="h-[25px]" />
                )
                : numberFormat(`${stableCoinCurrentSupply}`)
            }
          </p>
          <p className="text-mistBlue text-sm">
            Total Supply
          </p>
        </div>
      </div>
      <div className="px-4 pb-5 mt-8">
        <p className="text-primary font-semibold">
          Supply details
        </p>
        <Delimiter className="mt-3" />
        <div className="text-mistBlue text-sm mt-4 space-y-3">
          <p className="flex items-center justify-between">
            Contract Transaction
            <span className="underline">
              {txid.substring(0, 7)}
            </span>
          </p>
          <p className="flex items-center justify-between">
            Supply Type
            <span>
              {
                isStableCoinMaxSupplyLoading
                  ? (
                    <Loader className="h-5" />
                  )
                  : (
                    stableCoinMaxSupply
                      ? (
                        <>
                          Finite (max.
                          {' '}
                          {numberFormat(`${stableCoinMaxSupply}`)}
                          )
                        </>
                      )
                      : 'Infinite'
                  )
              }
            </span>
          </p>
          <p className="flex items-center justify-between">
            Allocated
            <span>
              {
                isStableCoinCurrentAllocatedLoading
                  ? (
                    <Loader className="h-4" />
                  )
                  : numberFormat(`${stableCoinCurrentAllocated}`)
              }
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
};
