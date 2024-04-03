'use client';

import { FC, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import { Loader } from '@/Components/Loader';

import { numberFormat } from '@/utils/string_formats';

import { useCurrentAllocatedAmountToAccount } from '@/hooks/useAllocate';
import { StableCoin } from '@/hooks/useStableCoinsList';

export interface AllocatedAmountCellProps extends HTMLAttributes<HTMLDivElement> {
  accountAddress: string;
  currentStableCoin: StableCoin;
  loaderClassName?: string;
}

export const AllocatedAmountCell: FC<AllocatedAmountCellProps> = ({
  accountAddress,
  currentStableCoin,
  loaderClassName,
  ...props
}) => {
  const {
    data: currentAllocatedAmountToAccount,
    isFetching: isCurrentAllocatedAmountToAccountFetching,
  } = useCurrentAllocatedAmountToAccount(accountAddress, currentStableCoin);

  return (
    <div {...props}>
      {
        isCurrentAllocatedAmountToAccountFetching
          ? <Loader className={twMerge('h-4', loaderClassName)} />
          : (
            <>
              {numberFormat(`${currentAllocatedAmountToAccount}`)}
              {' '}
              {currentStableCoin.ticker}
            </>
          )
      }
    </div>
  );
};
