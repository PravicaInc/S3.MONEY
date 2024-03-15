import React, { FC, HTMLAttributes } from 'react';
import NextImage from 'next/image';
import { twMerge } from 'tailwind-merge';

import { SimpleCheckbox } from '@/Components/Form/Checkbox';

import { StableCoin } from '@/hooks/useStableCoinsList';

export interface StableCoinItemProps extends HTMLAttributes<HTMLButtonElement> {
  stableCoinItem: StableCoin;
  isSelected?: boolean;
}

export const StableCoinItem: FC<StableCoinItemProps> = ({ stableCoinItem, isSelected, className, ...props }) => (
  <button
    className={twMerge(
      'border rounded-[10px] px-4 py-3 flex items-center justify-between w-full text-left',
      isSelected ? 'border-actionPrimary' : 'border-borderPrimary',
      className
    )}
    {...props}
  >
    <div className="flex gap-4 items-center">
      <div className="flex items-center justify-center w-8 h-8">
        {
          stableCoinItem.icon
            ? (
              <NextImage
                className="rounded-full"
                src={stableCoinItem.icon}
                alt="Wallet Icon"
                width={32}
                height={32}
              />
            )
            : (
              <div className="w-full h-full bg-[#F0F0F0] rounded-full" />
            )
        }
      </div>
      <div>
        <p className="font-semibold text-primary">
          {stableCoinItem.name}
        </p>
        <p className="text-sm text-[grayText] mt-[2px]">
          {stableCoinItem.tokenName}
        </p>
      </div>
    </div>
    <SimpleCheckbox
      checked={isSelected}
    />
  </button>
);
