import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import type { WalletAccount } from '@mysten/wallet-standard';
import { ReadonlyWalletAccount } from '@mysten/wallet-standard';
import { act, cleanup, getQueriesForElement, render, RenderResult } from '@testing-library/react';

import '@testing-library/jest-dom';

import { Header } from '@/Components/Header';

import { Providers } from '@/app/providers';

export function createMockAccount(accountOverrides: Partial<WalletAccount> = {}) {
  const keypair = new Ed25519Keypair();

  return new ReadonlyWalletAccount({
    address: '0x11...1111',
    publicKey: keypair.getPublicKey().toSuiBytes(),
    chains: ['sui:unknown'],
    features: ['sui:signAndExecuteTransactionBlock', 'sui:signTransactionBlock'],
    ...accountOverrides,
  });
}

const renderHeaderWithWalletProps = () => render(
  <Providers>
    <Header />
  </Providers>
);

describe('Header:', () => {
  afterAll(cleanup);

  describe('Header with loading state:', () => {
    let renderResult: RenderResult;

    beforeEach(() => {
      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'idle');

      renderResult = renderHeaderWithWalletProps();
    });

    afterEach(() => renderResult.unmount);

    it('Show loader', () => {
      expect(getQueriesForElement(renderResult.getByTestId('header')).queryByTestId('loader')).toBeVisible();
    });
  });

  describe('Header with disconnected state:', () => {
    let renderResult: RenderResult;

    beforeEach(() => {
      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'idle');

      renderResult = renderHeaderWithWalletProps();
    });

    afterEach(() => renderResult.unmount);

    it('Show loader', () => {
      expect(getQueriesForElement(renderResult.getByTestId('header')).queryByTestId('loader')).toBeVisible();
    });
  });

  describe('Header with connected state:', () => {
    let renderResult: RenderResult;
    const shortWalletAddress = '0x11...1111';

    beforeEach(() => {
      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');
      jest.mocked(useCurrentAccount).mockImplementation(createMockAccount);

      renderResult = renderHeaderWithWalletProps();
    });

    afterEach(() => renderResult.unmount);

    it('Don`t show loader', () => {
      expect(getQueriesForElement(renderResult.getByTestId('header')).queryByTestId('loader')).toBeNull();
    });

    it('Show account info', () => {
      expect(renderResult.queryByText(new RegExp(shortWalletAddress))).toBeVisible();
    });

    it('Show modal', () => {
      const logoutButton = getQueriesForElement(renderResult.getByTestId('header')).queryByRole('button');

      act(() => {
        logoutButton?.click();
      });

      expect(renderResult.queryByRole('dialog')).toHaveAttribute('open');
    });

    it('Snapshot', () => {
      expect(renderResult.container).toMatchSnapshot();
    });
  });
});
