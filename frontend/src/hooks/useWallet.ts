'use client';

import { createContext, useContext } from 'react';
import { ConnectionStatus, KitError, WalletContextState } from '@suiet/wallet-kit';

export const IS_WALLET_CONNECTED_KEY = 'isWalletConnected';

export interface WalletWithCorrectStatusContextProps extends WalletContextState {
  disconnected: boolean,
  onWalletConnected: () => void,
  shortWalletAddress: string,
}

export const WalletWithCorrectStatusContext = createContext<WalletWithCorrectStatusContextProps>({
  // @suiet/wallet-kit does not provide default values for WalletContextState here https://github.com/suiet/wallet-kit/blob/main/packages/kit/src/hooks/useWallet.ts#L74
  configuredWallets: [],
  detectedWallets: [],
  allAvailableWallets: [],
  chains: [],
  chain: undefined,
  name: undefined,
  adapter: undefined,
  account: undefined,
  address: undefined,
  async select() {
    throw new KitError(missProviderMessage('select'));
  },
  on() {
    throw new KitError(missProviderMessage('on'));
  },
  async disconnect() {
    throw new KitError(missProviderMessage('disconnect'));
  },
  getAccounts() {
    throw new KitError(missProviderMessage('getAccounts'));
  },
  async signAndExecuteTransactionBlock() {
    throw new KitError(missProviderMessage('signAndExecuteTransactionBlock'));
  },
  async signTransactionBlock() {
    throw new KitError(missProviderMessage('signTransactionBlock'));
  },
  async signPersonalMessage() {
    throw new KitError(missProviderMessage('signPersonalMessage'));
  },
  async signMessage() {
    throw new KitError(missProviderMessage('signMessage'));
  },
  verifySignedMessage() {
    throw new KitError(missProviderMessage('verifySignedMessage'));
  },
  status: ConnectionStatus.CONNECTING,
  connecting: true,
  connected: false,
  disconnected: false,
  onWalletConnected: () => {},
  shortWalletAddress: '',
});

export function useWallet() {
  return useContext(WalletWithCorrectStatusContext);
}

function missProviderMessage(action: string) {
  return `Failed to call ${action}, missing context provider to run within`;
}
