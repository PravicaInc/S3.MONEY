'use client';

import { FC, HTMLAttributes } from 'react';
import NextImage from 'next/image';
import { twMerge } from 'tailwind-merge';

import { Delimiter } from '@/Components/Delimiter';

import { InitialStableCoinData } from '@/app/create-stablecoin/components/InitialDetails';
import { SupplyStableCoinData, SupplyTypes } from '@/app/create-stablecoin/components/SupplyDetails';

import { numberFormat } from '@/utils/string_formats';

interface StableCoinPreviewProps extends InitialStableCoinData, SupplyStableCoinData, HTMLAttributes<HTMLDivElement> {}

export const StableCoinPreview: FC<Partial<StableCoinPreviewProps>> = ({
  name,
  ticker,
  initialSupply,
  maxSupply,
  decimals,
  className,
  icon,
  supplyType = SupplyTypes.Infinite,
  ...props
}) => (
  <div className={twMerge('bg-white border rounded-xl text-primary border-borderPrimary', className)} {...props}>
    <p className="text-lg font-semibold p-5 border-b border-borderPrimary">
      Preview Details
    </p>
    <div className="p-6 pt-5">
      {
        icon && (
          <NextImage
            className="rounded-full"
            src={icon}
            width={48}
            height={48}
            alt="New StableCoin icon"
          />
        )
      }
      <p className="text-lg font-semibold mt-3">
        {name}
        {' '}
        (
        {ticker}
        )
      </p>
      {
        (initialSupply || maxSupply || decimals) && (
          <>
            <p className="font-semibold mt-5">
              Supply details
            </p>
            <Delimiter className="mt-3 mb-4" />
            <div className="flex items-center justify-between text-secondary text-sm">
              <span>
                Factory Contract ID
              </span>
              <span>
                0.1525e49 (Default)
              </span>
            </div>
            {
              initialSupply && (
                <div className="flex items-center justify-between text-secondary text-sm">
                  <span>
                    Initial Supply
                  </span>
                  <span>
                    {numberFormat(`${initialSupply}`)}
                  </span>
                </div>
              )
            }
            {
              maxSupply && (
                <div className="flex items-center justify-between text-secondary text-sm">
                  <span>
                    Max Supply
                  </span>
                  <span>
                    {numberFormat(`${maxSupply}`)}
                  </span>
                </div>
              )
            }
            <div className="flex items-center justify-between text-secondary text-sm">
              <span>
                Supply Type
              </span>
              <span className="capitalize">
                {supplyType}
              </span>
            </div>
            {
              typeof decimals != 'undefined' && (
                <div className="flex items-center justify-between text-secondary text-sm">
                  <span>
                    Decimals
                  </span>
                  <span>
                    {numberFormat(`${decimals}`)}
                  </span>
                </div>
              )
            }
          </>
        )
      }
    </div>
  </div>
);
