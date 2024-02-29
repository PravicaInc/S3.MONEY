'use client';

import { HTMLAttributes } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import NextImage from 'next/image';
import { twMerge } from 'tailwind-merge';

import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

import LogoIcon from '@/../public/images/logo.svg?jsx';

export function Header({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const wallet = useWallet();

  return (
    <div
      className={twMerge(
        'max-w-screen-2xl mx-auto py-4 flex justify-between items-center h-32',
        className
      )}
      {...props}
    >
      <LogoIcon />
      {
        wallet.connected && wallet.account?.address && (
          <div className="border-2 rounded-lg p-3 flex items-center gap-6">
            {
              wallet.adapter?.icon && (
                <NextImage
                  className="rounded-full"
                  src={wallet.adapter?.icon}
                  alt="Wallet Icon"
                  width={62}
                  height={62}
                />
              )
            }
            {`${wallet.account?.address.substring(0, 4)}...${wallet.account?.address.substring(wallet.account?.address.length - 4)}`}
            <Menu
              menuButton={
                <MenuButton className="text-5xl font-bold">
                  ⋮
                </MenuButton>
              }
              align="end"
            >
              <MenuItem onClick={wallet.disconnect}>
                Disconnect
              </MenuItem>
            </Menu>
          </div>
        )
      }
    </div>
  );
}
