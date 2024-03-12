import type { WalletAccount } from '@mysten/wallet-standard';
import { ReadonlyWalletAccount } from '@mysten/wallet-standard';

export const TEST_WALLET_ACCOUNT_ADDRESS = '0x1111111111111111111111111111111111111111111111111111111111111111';

export const TEST_SHORT_WALLET_ACCOUNT_ADDRESS = '0x11...1111';

export const createMockAccount = (accountOverrides: Partial<WalletAccount> = {}) => new ReadonlyWalletAccount({
  address: '0x11...1111',
  publicKey: new Uint8Array(),
  chains: ['sui:unknown'],
  features: ['sui:signAndExecuteTransactionBlock', 'sui:signTransactionBlock'],
  ...accountOverrides,
});
