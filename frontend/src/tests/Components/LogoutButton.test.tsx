import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { cleanup, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom';

import { LogoutButton } from '@/Components/LogoutButton';

import {
  createMockAccount,
  TEST_EMAIL_ADDRESS,
  TEST_SHORT_WALLET_ACCOUNT_ADDRESS,
} from '@/tests/utils/create_mock_wallet_account';
import { renderWithProviders } from '@/tests/utils/render_with_providers';

const renderLogoutButtonWithProviders = () => renderWithProviders(<LogoutButton />);

let renderResult: RenderResult;

describe('LogoutButton:', () => {
  afterAll(cleanup);

  describe('LogoutButton with connected state:', () => {
    beforeEach(() => {
      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');
      jest.mocked(useCurrentAccount).mockImplementation(createMockAccount);

      renderResult = renderLogoutButtonWithProviders();
    });

    it('Show account info', () => {
      expect(renderResult.queryByText(new RegExp(TEST_SHORT_WALLET_ACCOUNT_ADDRESS))).toBeVisible();
    });

    it('Show modal', async () => {
      const user = userEvent.setup();

      const logoutButton = renderResult.getByRole('button', {
        name: new RegExp(TEST_SHORT_WALLET_ACCOUNT_ADDRESS),
      });

      await user.click(logoutButton);

      expect(renderResult.queryByRole('dialog')).toHaveAttribute('open');
    });

    it('Snapshot', () => {
      expect(renderResult.container).toMatchSnapshot();
    });
  });

  describe('LogoutButton with connected state via zkLogin:', () => {
    beforeEach(() => {
      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');
      jest.mocked(useCurrentAccount).mockImplementation(() => createMockAccount({
        label: TEST_EMAIL_ADDRESS,
      }));

      renderResult = renderLogoutButtonWithProviders();
    });

    it('Show account info', () => {
      expect(renderResult.queryByText(new RegExp(TEST_EMAIL_ADDRESS))).toBeVisible();
    });

    it('Snapshot', () => {
      expect(renderResult.container).toMatchSnapshot();
    });
  });
});
