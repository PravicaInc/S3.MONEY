'use client';

import { FC, HTMLAttributes, useCallback, useState } from 'react';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import LogoIcon from '@/../public/images/logo.svg?jsx';
import LogoutIcon from '@/../public/images/logout.svg?jsx';

import { Loader } from '@/Components/Loader';
import { LogoutModal } from '@/Components/LogoutModal';

import { PAGES_URLS } from '@/utils/const';

import { useWallet } from '@/hooks/useWallet';

export const Header: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  const wallet = useWallet();
  const router = useRouter();
  const pathname = usePathname();

  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

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
      <div
        data-testid="header"
        className="flex items-center justify-between max-w-screen-2xl mx-auto h-full"
      >
        <LogoIcon />
        {
          (wallet.connecting || wallet.disconnected) && (
            <Loader className="h-8" />
          )
        }
        {
          wallet.connected && wallet.shortWalletAddress && (
            <button
              className="
                border border-primaryBorder rounded-[10px]
                h-10 px-4 flex items-center justify-between gap-2
                text-secondary font-medium
                transition
                hover:bg-actionPrimary hover:bg-opacity-10 hover:border-actionSecondary
              "
              onClick={() => {
                setShowLogoutModal(true);
              }}
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
              <LogoutIcon />
            </button>
          )
        }
      </div>
      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        inProcess={wallet.connecting || wallet.disconnected}
        onProceed={disconnect}
      />
    </div>
  );
};
