import React, { FC, HTMLAttributes } from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import { Delimiter } from '@/Components/Delimiter';
import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Loader } from '@/Components/Loader';

import { PAGES_URLS } from '@/utils/const';
import { numberFormat } from '@/utils/string_formats';

import { StableCoin } from '@/hooks/useStableCoinsList';
import { useStableCoinCurrentSupply } from '@/hooks/useStableCoinSupply';

export interface StableCoinItemProps extends HTMLAttributes<HTMLDivElement> {
  stableCoinItem: StableCoin;
  isSelected?: boolean;
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
  const {
    data: stableCoinCurrentSupply = 0,
    isLoading: isLoadingStableCoinCurrentSupply,
  } = useStableCoinCurrentSupply(stableCoinItem);

  return (
    <div
      className={twMerge(
        'border border-borderPrimary p-6 bg-white rounded-[10px]',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full bg-seashell bg-no-repeat bg-center bg-cover"
          style={{
            backgroundImage: `url(${icon})`,
          }}
        />
        <p className="flex items-center gap-1">
          <span className="font-semibold text-primary">
            {ticker}
          </span>
          <span className="text-mistBlue text-sm">
            {name}
          </span>
        </p>
      </div>
      <p className="font-semibold mt-5">
        Supply details
      </p>
      <Delimiter className="mt-3 mb-4" />
      <div className="space-y-3">
        <div className="flex items-center justify-between text-secondary text-sm">
          <span>
            Current Supply
          </span>
          <span>
            {
              isLoadingStableCoinCurrentSupply
                ? (
                  <Loader className="h-4" />
                )
                : numberFormat(`${stableCoinCurrentSupply}`)
            }
          </span>
        </div>
      </div>
      <Link
        href={`${PAGES_URLS.dashboardOperations}?txid=${txid}`}
        className="rounded-xl block"
      >
        <Button
          view={BUTTON_VIEWS.secondary}
          className="mt-5 w-full h-[48px]"
        >
          Manage
        </Button>
      </Link>
    </div>
  );
};
