import React, { FC, HTMLAttributes, useMemo } from 'react';
import { useSuiClientContext } from '@mysten/dapp-kit';
import { twMerge } from 'tailwind-merge';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Loader } from '@/Components/Loader';

import { numberFormat/* , priceFormat */ } from '@/utils/string_formats';

import { useCurrentAllocated } from '@/hooks/useAllocate';
import { StableCoin } from '@/hooks/useStableCoinsList';
import { useStableCoinCurrentSupply, useStableCoinMaxSupply } from '@/hooks/useStableCoinSupply';

export interface StableCoinDetailsProps extends HTMLAttributes<HTMLDivElement> {
  stableCoinItem: StableCoin;
}

export const StableCoinDetails: FC<StableCoinDetailsProps> = ({
  stableCoinItem,
  className,
  ...props
}) => {
  const suiClientContext = useSuiClientContext();
  const {
    data: stableCoinCurrentSupply = 0,
    isLoading: isStableCoinCurrentSupplyLoading,
  } = useStableCoinCurrentSupply(stableCoinItem);
  const {
    data: stableCoinMaxSupply = 0,
    isLoading: isStableCoinMaxSupplyLoading,
  } = useStableCoinMaxSupply(
    stableCoinItem,
    {
      initialData: stableCoinItem.maxSupply,
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

  const details = useMemo(
    () => [
      // {
      //   title: 'Volume of (24h):',
      //   content: (
      //     isStableCoinCurrentSupplyLoading
      //       ? (
      //         <Loader className="h-4" />
      //       )
      //       // TODO: Add real data
      //       : priceFormat(`${stableCoinCurrentSupply}`)
      //   ),
      // },
      {
        title: 'Total Supply:',
        content: (
          isStableCoinCurrentSupplyLoading
            ? (
              <Loader className="h-4" />
            )
            : numberFormat(`${stableCoinCurrentSupply}`)
        ),
      },
      {
        title: 'Allocated Supply:',
        content: (
          isStableCoinCurrentAllocatedLoading
            ? (
              <Loader className="h-4" />
            )
            : numberFormat(`${stableCoinCurrentAllocated}`)
        ),
      },
      {
        title: 'Less: Not Allocated:',
        content: (
          isStableCoinCurrentAllocatedLoading || isStableCoinCurrentSupplyLoading
            ? (
              <Loader className="h-4" />
            )
            : numberFormat(`${stableCoinCurrentSupply - (stableCoinCurrentAllocated || 0)}`)
        ),
      },
      {
        title: 'Max Supply:',
        content: (
          isStableCoinMaxSupplyLoading
            ? (
              <Loader className="h-4" />
            )
            : (
              stableCoinMaxSupply
                ? numberFormat(`${stableCoinMaxSupply}`)
                : '♾️'
            )
        ),
      },
    ],
    [
      isStableCoinCurrentAllocatedLoading,
      isStableCoinCurrentSupplyLoading,
      isStableCoinMaxSupplyLoading,
      stableCoinCurrentAllocated,
      stableCoinCurrentSupply,
      stableCoinMaxSupply,
    ]
  );

  return (
    <div
      className={twMerge(
        'border border-borderPrimary rounded-xl bg-white',
        className
      )}
      {...props}
    >
      <div>
        <p className="p-5 text-primary text-lg font-semibold border-b border-borderPrimary">
          Stablecoin Details
        </p>
        <div className="px-5 pt-5 space-y-3">
          {
            details.map(({ title, content }) => (
              <div
                key={title}
                className="
                  border border-borderPrimary rounded-lg flex items-center justify-between px-4 py-3 font-medium
                "
              >
                <p className="text-mistBlue">
                  {title}
                </p>
                <span className="text-primary">
                  {content}
                </span>
              </div>
            ))
          }
        </div>
      </div>
      <a
        href={`https://suiscan.xyz/${suiClientContext.network}/tx/${stableCoinItem.txid}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-xl mx-5 my-5 block"
      >
        <Button
          view={BUTTON_VIEWS.secondary}
          className="h-12 w-full"
        >
          View transaction on the explorer
        </Button>
      </a>
    </div>
  );
};
