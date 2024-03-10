'use client';

import { FC, useCallback } from 'react';
import { BaseError, SuiWallet } from '@suiet/wallet-kit';
import { twMerge } from 'tailwind-merge';

import { Button, ButtonProps, primaryButtonClasses } from '@/Components/Form/Button';

import { useWallet } from '@/hooks/useWallet';

export interface WalletConnectButton extends ButtonProps {
  onConnectSuccess?: (walletName: string) => void;
  onConnectError?: (error: BaseError) => void;
}

export const WalletConnectButton: FC<WalletConnectButton> = ({
  onConnectSuccess,
  onConnectError,
  className,
  disabled,
  ...props
}) => {
  const wallet = useWallet();

  const onConnect = useCallback(
    async () => {
      try {
        await wallet.select(SuiWallet.name);

        wallet.onWalletConnected();

        if (onConnectSuccess) {
          onConnectSuccess(SuiWallet.name);
        }
      }
      catch (err) {
        if (onConnectError) {
          onConnectError(err as BaseError);
        }
      }
    },
    [wallet, onConnectSuccess, onConnectError]
  );

  return (
    <Button
      className={twMerge(
        primaryButtonClasses,
        className,
        disabled && 'pointer-events-none bg-slate-300 border-slate-400 text-white'
      )}
      onClick={onConnect}

      {...props}
    />
  );
};
