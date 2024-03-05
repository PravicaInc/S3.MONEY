'use client';

import { ConnectButton, ConnectButtonProps } from '@suiet/wallet-kit';

import { useWallet } from '@/hooks/useWallet';

export function WalletConnectButton({ onConnectSuccess, ...props }: ConnectButtonProps) {
  const wallet = useWallet();

  return (
    <ConnectButton
      onConnectSuccess={(...args) => {
        wallet.onWalletConnected();

        if (onConnectSuccess) {
          onConnectSuccess(...args);
        }
      }}

      {...props}
    />
  );
}
