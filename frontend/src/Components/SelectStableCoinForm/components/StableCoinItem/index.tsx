import React, { FC, HTMLAttributes } from 'react';
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
      <div
        className="w-8 h-8 rounded-full bg-seashell bg-no-repeat bg-center bg-cover"
        style={{
          backgroundImage: `url(${stableCoinItem.icon})`,
        }}
      />
      <div>
        <p className="font-semibold text-primary">
          {stableCoinItem.name}
        </p>
        <p className="text-sm text-grayText mt-[2px]">
          {stableCoinItem.tokenName}
        </p>
      </div>
    </div>
    <SimpleCheckbox
      checked={isSelected}
    />
  </button>
);
