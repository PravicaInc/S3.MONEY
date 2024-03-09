'use client';

import { FC, HTMLAttributes, useCallback } from 'react';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import LogoIcon from '@/../public/images/logo.svg?jsx';
import LogoutIcon from '@/../public/images/logout.svg?jsx';

import { Loader } from '@/Components/Loader';

import { PAGES_URLS } from '@/utils/const';

import { useWallet } from '@/hooks/useWallet';

export const Header: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  const wallet = useWallet();
  const router = useRouter();
  const pathname = usePathname();

  const disconnect = useCallback(
    () => {
      wallet.disconnect();
      router.replace(`${PAGES_URLS.signIn}?next=${encodeURIComponent(pathname)}`);
    },
    [wallet, router, pathname]
  );

  return (
    <div
      className={twMerge(
        'min-h-20 px-8 border-b border-primaryBorder bg-white',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto h-full">
        <LogoIcon />
        {
          (wallet.connecting || wallet.disconnected) && (
            <Loader className="h-8" />
          )
        }
        {
          wallet.connected && wallet.shortWalletAddress && (
            <div
              className="
                border border-primaryBorder rounded-[10px]
                h-10 px-4 flex items-center justify-between gap-2
                text-secondary font-medium
              "
            >
              {
                wallet.adapter?.icon && (
                  <NextImage
                    className="rounded-full"
                    src={wallet.adapter?.icon}
                    alt="Wallet Icon"
                    width={24}
                    height={24}
                  />
                )
              }
              {wallet.shortWalletAddress}
              <button
                onClick={disconnect}
              >
                <LogoutIcon />
              </button>
            </div>
          )
        }
      </div>
    </div>
  );
};
