'use client';

import { FC } from 'react';
import { ConnectButton, ConnectButtonProps } from '@suiet/wallet-kit';
import { twMerge } from 'tailwind-merge';

import { defaultButtonClasses } from '@/Components/Form/Button';

import { useWallet } from '@/hooks/useWallet';

export type WalletConnectButton = ConnectButtonProps & {
  disabled?: boolean;
}

export const WalletConnectButton: FC<WalletConnectButton> = ({ onConnectSuccess, className, disabled, ...props }) => {
  const wallet = useWallet();

  return (
    <ConnectButton
      className={twMerge(
        defaultButtonClasses,
        className,
        disabled && 'pointer-events-none bg-slate-300 border-slate-400 text-white'
      )}
      onConnectSuccess={(...args) => {
        wallet.onWalletConnected();

        if (onConnectSuccess) {
          onConnectSuccess(...args);
        }
      }}

      {...props}
    />
  );
};
