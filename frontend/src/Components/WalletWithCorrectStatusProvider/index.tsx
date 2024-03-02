'use client';

import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { ConnectionStatus, useWallet as useSuietWallet, WalletContextState } from '@suiet/wallet-kit';

import { IS_WALLET_CONNECTED_KEY, WalletWithCorrectStatusContext } from '@/hooks/useWallet';

/**
 * `useSuietWallet` creates a `wallet` object that contains "status === 'disconnected'" - https://kit.suiet.app/docs/Hooks/useWallet#connection-status
 * This creates a problem for the correct display of the wallet's connecting status
 */
export function WalletWithCorrectStatusProvider({ children }: PropsWithChildren) {
  const [isWalletConnectedBefore, setIsWalletConnectedBefore] = useState<boolean>(
    typeof localStorage !== 'undefined'
      ? JSON.parse(localStorage.getItem(IS_WALLET_CONNECTED_KEY) ?? 'false')
      : false
  );
  const [walletStatus, setWalletStatus] = useState<WalletContextState['status']>(ConnectionStatus.CONNECTING);
  const [walletConnecting, setWalletConnecting] = useState<boolean>(true);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);

  const wallet = useSuietWallet();

  const disconnectWallet = useCallback(
    async (): Promise<void> => {
      setIsWalletConnectedBefore(false);
      localStorage.setItem(IS_WALLET_CONNECTED_KEY, 'false');

      await wallet.disconnect();
    },
    [wallet]
  );

  useEffect(
    () => {
      if (isWalletConnectedBefore) {
        if (wallet.connected) {
          setWalletStatus(wallet.status);
          setWalletConnecting(wallet.connecting);
          setWalletConnected(wallet.connected);
        }
      }
      else {
        setWalletStatus(wallet.status);
        setWalletConnecting(wallet.connecting);
        setWalletConnected(wallet.connected);
      }

      if (wallet.connected) {
        const offChange = wallet.on('change', ({ accounts }) => {
          if (!accounts?.length) {
            disconnectWallet();
          }
        });

        return () => {
          offChange();
        };
      }
    },
    [wallet, disconnectWallet, isWalletConnectedBefore]
  );

  return (
    <WalletWithCorrectStatusContext.Provider
      value={{
        ...wallet,
        status: walletStatus,
        connecting: walletConnecting,
        connected: walletConnected,
        disconnected: walletStatus === ConnectionStatus.DISCONNECTED,
        disconnect: disconnectWallet,
        onWalletConnected,
      }}
    >
      {children}
    </WalletWithCorrectStatusContext.Provider>
  );

  function onWalletConnected() {
    setIsWalletConnectedBefore(true);
    localStorage.setItem(IS_WALLET_CONNECTED_KEY, 'true');
  }
}
