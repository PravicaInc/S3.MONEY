'use client';

import { FC } from 'react';
import { useSuiClientContext } from '@mysten/dapp-kit';
import Link, { LinkProps } from 'next/link';
import { twMerge } from 'tailwind-merge';

import LogoIcon from '@/../public/images/logo.svg?jsx';

import { PAGES_URLS } from '@/utils/const';

export interface LogoProps extends Omit<LinkProps, 'href'> {
  className?: string;
}

export const Logo: FC<LogoProps> = ({ className, ...props }) => {
  const suiClientContext = useSuiClientContext();

  return (
    <Link
      {...props}
      className={twMerge('flex items-end gap-[2px]', className)}
      href={PAGES_URLS.home}
    >
      <LogoIcon />
      {
        ['testnet', 'devnet'].includes(suiClientContext.network) && (
          <span
            className="
              capitalize text-black text-[8px] font-bold
               block bg-[#F4DC00] px-[10px] py-[2px] rounded-[5px] mb-[6px]"
          >
            {suiClientContext.network}
          </span>
        )
      }
    </Link>
  );
};
