'use client';

import { ButtonHTMLAttributes, FC, useCallback, useState } from 'react';
import { useCurrentAccount, useCurrentWallet, useDisconnectWallet } from '@mysten/dapp-kit';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import LogoutIcon from '@/../public/images/logout.svg?jsx';

import { LogoutModal } from '@/Components/LogoutModal';

import { PAGES_URLS } from '@/utils/const';

import { useShortAccountAddress } from '@/hooks/useShortAccountAddress';

export const LogoutButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => {
  const router = useRouter();
  const pathname = usePathname();

  const account = useCurrentAccount();
  const { currentWallet, connectionStatus } = useCurrentWallet();
  const shortAccountAddress = useShortAccountAddress();
  const disconnectWallet = useDisconnectWallet();

  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  const disconnect = useCallback(
    async () => {
      await disconnectWallet.mutateAsync();

      router.replace(`${PAGES_URLS.signIn}?next=${encodeURIComponent(pathname)}`);
    },
    [disconnectWallet, router, pathname]
  );

  return (
    <>
      {
        shortAccountAddress && (
          <button
            className={twMerge(
              `
                border border-borderPrimary rounded-[10px]
                h-10 px-4 flex items-center justify-between gap-2
                text-secondary font-medium text-sm
                transition
                hover:bg-actionPrimary hover:bg-opacity-5 hover:border-actionSecondary
              `,
              className
            )}
            onClick={() => {
              setShowLogoutModal(true);
            }}
            {...props}
          >
            {
              (account?.icon || currentWallet?.icon) && (
                <NextImage
                  className="rounded-full"
                  src={(account?.icon || currentWallet?.icon) as string}
                  alt="Wallet Icon"
                  width={24}
                  height={24}
                />
              )
            }
            {account?.label || shortAccountAddress}
            <LogoutIcon />
          </button>
        )
      }
      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        inProcess={connectionStatus === 'disconnected'}
        onProceed={disconnect}
      />
    </>
  );
};
