'use client';

import { FC, useCallback } from 'react';
import { useConnectWallet, useWallets } from '@mysten/dapp-kit';
import { twMerge } from 'tailwind-merge';

import { Button, ButtonProps1, primaryButtonClasses } from '@/Components/Form/Button';

import { WALLETS } from '@/utils/const';

export interface WalletConnectButton extends ButtonProps1 {
  onConnectSuccess?: (walletName: string) => void;
  onConnectError?: (error: unknown) => void;
}

export const WalletConnectButton: FC<WalletConnectButton> = ({
  onConnectSuccess,
  onConnectError,
  className,
  disabled,
  ...props
}) => {
  const wallets = useWallets();
  const connectWallet = useConnectWallet();

  const onConnect = useCallback(
    async () => {
      try {
        const suiWallet = wallets.find(({ name }) => name === WALLETS.SuiWallet);

        if (suiWallet) {
          await connectWallet.mutateAsync({
            wallet: suiWallet,
          });

          if (onConnectSuccess) {
            onConnectSuccess(suiWallet?.name);
          }
        }
      }
      catch (err) {
        if (onConnectError) {
          onConnectError(err);
        }
      }
    },
    [connectWallet, wallets, onConnectSuccess, onConnectError]
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
