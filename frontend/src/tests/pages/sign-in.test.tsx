import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { act, cleanup, RenderResult, screen as testScreen } from '@testing-library/react';

import '@testing-library/jest-dom';

import SignInPage from '@/app/sign-in/page';

import { createMockAccount } from '@/tests/utils/create_mock_wallet_account';
import { renderWithProviders } from '@/tests/utils/render_with_providers';

const renderSignInPageWithProviders = () => renderWithProviders(<SignInPage />);

let renderResult: RenderResult;

describe('Sign-in page:', () => {
  afterAll(cleanup);

  describe('Sign-in page with loading state:', () => {
    beforeEach(() => {
      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'idle');

      renderResult = renderSignInPageWithProviders();
    });

    afterEach(() => renderResult.unmount);

    it('Show loader', () => {
      expect(renderResult.queryByTestId('loader')).toBeVisible();
    });
  });

  describe('Sign-in page with disconnected state:', () => {
    beforeEach(() => {
      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');

      renderResult = renderSignInPageWithProviders();
    });

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
    beforeEach(() => {
      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');
      jest.mocked(useCurrentAccount).mockImplementation(createMockAccount);

      renderResult = renderSignInPageWithProviders();
    });

    it('Show redirect', () => {
      expect(renderResult.queryByText('Redirecting ...')).toBeVisible();
    });
  });
});
