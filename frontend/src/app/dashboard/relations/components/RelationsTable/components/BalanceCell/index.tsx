'use client';

import { FC, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import { Loader } from '@/Components/Loader';

import { numberFormat } from '@/utils/string_formats';

import { useCurrentStableCoinBalance } from '@/hooks/useCurrentBalance';
import { StableCoin } from '@/hooks/useStableCoinsList';

export interface BalanceCellProps extends HTMLAttributes<HTMLDivElement> {
  accountAddress: string;
  currentStableCoin: StableCoin;
  loaderClassName?: string;
}

export const BalanceCell: FC<BalanceCellProps> = ({ accountAddress, currentStableCoin, loaderClassName, ...props }) => {
  const {
    data: currentStableCoinBalance,
    isFetching: isCurrentStableCoinBalanceFetching,
  } = useCurrentStableCoinBalance(accountAddress, currentStableCoin);

  return (
    <div {...props}>
      {
        isCurrentStableCoinBalanceFetching
          ? <Loader className={twMerge('h-4', loaderClassName)} />
          : (
            <>
              {numberFormat(`${currentStableCoinBalance}`)}
              {' '}
              {currentStableCoin.ticker}
            </>
          )
      }
    </div>
  );
};
