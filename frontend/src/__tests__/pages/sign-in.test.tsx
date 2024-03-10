import { act, cleanup, render, RenderResult, screen as testScreen } from '@testing-library/react';

import '@testing-library/jest-dom';

import SignInPage from '@/app/sign-in/page';

import {
  DEFAULT_WALLET_WITH_CORRECT_STATUS_VALUE,
  WalletWithCorrectStatusContext,
  WalletWithCorrectStatusContextProps,
} from '@/hooks/useWallet';

const renderSignInPageWithWalletProps = (
  { walletProps, ...renderOptions }: { walletProps: Partial<WalletWithCorrectStatusContextProps> }
) => render(
  <WalletWithCorrectStatusContext.Provider
    value={{
      ...DEFAULT_WALLET_WITH_CORRECT_STATUS_VALUE,
      ...walletProps,
    }}
  >
    <SignInPage />
  </WalletWithCorrectStatusContext.Provider>,
  renderOptions
);

describe('Sign-in page:', () => {
  afterAll(cleanup);

  describe('Sign-in page with loading state:', () => {
    let renderResult: RenderResult;

    beforeEach(() => {
      renderResult = renderSignInPageWithWalletProps(
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

  describe('Sign-in page with disconnected state:', () => {
    let renderResult: RenderResult;

    beforeEach(() => {
      renderResult = renderSignInPageWithWalletProps(
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

    it('Don`t show loader', () => {
      expect(renderResult.queryByTestId('loader')).toBeNull();
    });

    it('Show wallet connect button', () => {
      expect(renderResult.queryByText('Sign In with Sui Wallet')).toBeVisible();
    });

    it('Snapshot', () => {
      expect(renderResult.container).toMatchSnapshot();
    });

    it('Don`t show connect modal', () => {
      const connectButton = renderResult.queryByText('Sign In with Sui Wallet');

      act(() => {
        connectButton?.click();
      });

      expect(testScreen.queryByText('Connect Wallet')).toBeNull();
    });
  });

  describe('Sign-in page with connected state:', () => {
    let renderResult: RenderResult;
    const shortWalletAddress = '0x11...1111';

    beforeEach(() => {
      renderResult = renderSignInPageWithWalletProps(
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

    it('Show redirect', () => {
      expect(renderResult.queryByText('Redirecting ...')).toBeVisible();
    });
  });
});
