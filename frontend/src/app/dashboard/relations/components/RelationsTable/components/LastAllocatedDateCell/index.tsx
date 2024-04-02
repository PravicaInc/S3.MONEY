'use client';

import { FC, HTMLAttributes } from 'react';
import moment from 'moment';
import { twMerge } from 'tailwind-merge';

import { Loader } from '@/Components/Loader';

import { useLastAllocatedDateToAccount } from '@/hooks/useAllocate';
import { StableCoin } from '@/hooks/useStableCoinsList';

export interface LastAllocatedDateCellProps extends HTMLAttributes<HTMLDivElement> {
  accountAddress: string;
  currentStableCoin: StableCoin;
  loaderClassName?: string;
}

export const LastAllocatedDateCell: FC<LastAllocatedDateCellProps> = ({
  accountAddress,
  currentStableCoin,
  loaderClassName,
  ...props
}) => {
  const {
    data: lastAllocatedDateToAccount,
    isFetching: isLastAllocatedDateToAccountFetching,
  } = useLastAllocatedDateToAccount(accountAddress, currentStableCoin);

  return (
    <div {...props}>
      {
        isLastAllocatedDateToAccountFetching
          ? <Loader className={twMerge('h-4', loaderClassName)} />
          : (
            lastAllocatedDateToAccount
              ? moment(lastAllocatedDateToAccount).format('DD.MM.YYYY @HH:mm')
              : '-'
          )
      }
    </div>
  );
};
