import React, { FC, HTMLAttributes, ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';

import { SimpleCheckbox } from '@/Components/Form/Checkbox';

export interface StableCoinItem {
  name: string;
  tokenName: string;
  icon?: ReactElement;
  selected: boolean;
}

export interface StableCoinItemProps extends HTMLAttributes<HTMLButtonElement> {
  stableCoinItem: StableCoinItem;
}

export const StableCoinItem: FC<StableCoinItemProps> = ({ stableCoinItem, className, ...props }) => (
  <button
    className={twMerge(
      'border rounded-[10px] px-4 py-3 flex items-center justify-between w-full text-left',
      stableCoinItem.selected ? 'border-actionPrimary' : 'border-borderPrimary',
      className
    )}
    {...props}
  >
    <div className="flex gap-4 items-center">
      <div className="flex items-center justify-center w-8 h-8">
        {stableCoinItem.icon || (
          <div className="w-full h-full bg-[#F0F0F0] rounded-full" />
        )}
      </div>
      <div>
        <p className="font-semibold text-primary">
          {stableCoinItem.name}
        </p>
        <p className="text-sm text-[#666D80] mt-[2px]">
          {stableCoinItem.tokenName}
        </p>
      </div>
    </div>
    <SimpleCheckbox
      checked={stableCoinItem.selected}
    />
  </button>
);
