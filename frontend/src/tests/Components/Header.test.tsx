import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { act, cleanup, getQueriesForElement, RenderResult } from '@testing-library/react';

import '@testing-library/jest-dom';

import { Header } from '@/Components/Header';

import { createMockAccount, TEST_SHORT_WALLET_ACCOUNT_ADDRESS } from '@/tests/utils/create_mock_wallet_account';
import { renderWithProviders } from '@/tests/utils/render_with_providers';

const renderHeaderWithProviders = () => renderWithProviders(<Header />);

let renderResult: RenderResult;

describe('Header:', () => {
  afterAll(cleanup);

  describe('Header with loading state:', () => {
    beforeEach(() => {
      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'idle');

      renderResult = renderHeaderWithProviders();
    });

    it('Show loader', () => {
      expect(getQueriesForElement(renderResult.getByTestId('header')).queryByTestId('loader')).toBeVisible();
    });
  });

  describe('Header with disconnected state:', () => {
    beforeEach(() => {
      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');

      renderResult = renderHeaderWithProviders();
    });

    it('Show loader', () => {
      expect(getQueriesForElement(renderResult.getByTestId('header')).queryByTestId('loader')).toBeVisible();
    });
  });

  describe('Header with connected state:', () => {
    beforeEach(() => {
      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');
      jest.mocked(useCurrentAccount).mockImplementation(createMockAccount);

      renderResult = renderHeaderWithProviders();
    });

    it('Don`t show loader', () => {
      expect(getQueriesForElement(renderResult.getByTestId('header')).queryByTestId('loader')).toBeNull();
    });

    it('Show account info', () => {
      expect(renderResult.queryByText(new RegExp(TEST_SHORT_WALLET_ACCOUNT_ADDRESS))).toBeVisible();
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
