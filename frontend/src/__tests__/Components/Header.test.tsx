import { act, cleanup, getQueriesForElement, render, RenderResult } from '@testing-library/react';

import '@testing-library/jest-dom';

import { Header } from '@/Components/Header';

import {
  DEFAULT_WALLET_WITH_CORRECT_STATUS_VALUE,
  WalletWithCorrectStatusContext,
  WalletWithCorrectStatusContextProps,
} from '@/hooks/useWallet';

const renderHeaderWithWalletProps = (
  { walletProps, ...renderOptions }: { walletProps: Partial<WalletWithCorrectStatusContextProps> }
) => render(
  <WalletWithCorrectStatusContext.Provider
    value={{
      ...DEFAULT_WALLET_WITH_CORRECT_STATUS_VALUE,
      ...walletProps,
    }}
  >
    <Header />
  </WalletWithCorrectStatusContext.Provider>,
  renderOptions
);

describe('Header:', () => {
  afterAll(cleanup);

  describe('Header with loading state:', () => {
    let renderResult: RenderResult;

    beforeEach(() => {
      renderResult = renderHeaderWithWalletProps(
        {
          walletProps: {
            status: 'connecting',
            connecting: true,
            connected: false,
            disconnected: false,
          },
        }
      );
    });

    afterEach(() => renderResult.unmount);

    it('Show loader', () => {
      expect(getQueriesForElement(renderResult.getByTestId('header')).queryByTestId('loader')).toBeVisible();
    });
  });

  describe('Header with disconnected state:', () => {
    let renderResult: RenderResult;

    beforeEach(() => {
      renderResult = renderHeaderWithWalletProps(
        {
          walletProps: {
            status: 'disconnected',
            connecting: false,
            connected: false,
            disconnected: true,
          },
        }
      );
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
      renderResult = renderHeaderWithWalletProps(
        {
          walletProps: {
            shortWalletAddress,
            status: 'connected',
            connecting: false,
            connected: true,
            disconnected: false,
          },
        }
      );
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
