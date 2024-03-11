import { cleanup, render, RenderResult } from '@testing-library/react';

import '@testing-library/jest-dom';

import HomePage from '@/app/home/page';

import {
  DEFAULT_WALLET_WITH_CORRECT_STATUS_VALUE,
  WalletWithCorrectStatusContext,
  WalletWithCorrectStatusContextProps,
} from '@/hooks/useWallet';

const renderHomePageWithWalletProps = (
  { walletProps, ...renderOptions }: { walletProps: Partial<WalletWithCorrectStatusContextProps> }
) => render(
  <WalletWithCorrectStatusContext.Provider
    value={{
      ...DEFAULT_WALLET_WITH_CORRECT_STATUS_VALUE,
      ...walletProps,
    }}
  >
    <HomePage />
  </WalletWithCorrectStatusContext.Provider>,
  renderOptions
);

describe('Home page:', () => {
  afterAll(cleanup);

  describe('Home page with loading state:', () => {
    let renderResult: RenderResult;

    beforeEach(() => {
      renderResult = renderHomePageWithWalletProps(
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
      expect(renderResult.queryByTestId('loader')).toBeVisible();
    });
  });

  describe('Home page with disconnected state:', () => {
    let renderResult: RenderResult;

    beforeEach(() => {
      renderResult = renderHomePageWithWalletProps(
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
      expect(renderResult.queryByTestId('loader')).toBeVisible();
    });
  });

  describe('Home page with connected state:', () => {
    let renderResult: RenderResult;
    const shortWalletAddress = '0x11...1111';

    beforeEach(() => {
      renderResult = renderHomePageWithWalletProps(
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
      expect(renderResult.queryByTestId('loader')).toBeNull();
    });

    it('Show stablecoin form', () => {
      expect(renderResult.queryByText('Select Stablecoin')).toBeVisible();
    });

    it('Snapshot', () => {
      expect(renderResult.container).toMatchSnapshot();
    });
  });
});
