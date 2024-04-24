'use client';

import { FC, HTMLAttributes } from 'react';
import { useSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import { LogoutButton } from '@/Components/LogoutButton';
import { SelectStableCoinDropdown } from '@/Components/SelectStableCoinDropdown';

import { useShortAccountAddress } from '@/hooks/useShortAccountAddress';

export const DashboardTopNavBar: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  const shortAccountAddress = useShortAccountAddress();
  const searchParams = useSearchParams();

  return (
    <div
      className={twMerge(
        'flex items-center justify-end gap-2 px-6 h-20 border-b border-borderPrimary bg-white',
        className
      )}
      {...props}
    >
      {
        searchParams.get('txid') && (
          <SelectStableCoinDropdown />
        )
      }
      {
        shortAccountAddress && (
          <LogoutButton />
        )
      }
    </div>
  );
};
