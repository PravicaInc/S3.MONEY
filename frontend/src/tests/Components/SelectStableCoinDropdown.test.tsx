import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { cleanup, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation';
import qs from 'qs';

import '@testing-library/jest-dom';

import { SelectStableCoinDropdown } from '@/Components/SelectStableCoinDropdown';

import { useStableCoinsList } from '@/hooks/useStableCoinsList';

import {
  createMockStableCoinList,
  TEST_STABLE_COIN1,
  TEST_STABLE_COIN2,
} from '@/tests/utils/create_mock_stable_coin_list';
import { createMockAccount } from '@/tests/utils/create_mock_wallet_account';
import { renderWithProviders } from '@/tests/utils/render_with_providers';

const renderSelectStableCoinDropdownWithProviders = () => renderWithProviders(<SelectStableCoinDropdown />);

let renderResult: RenderResult;

describe('SelectStableCoinDropdown:', () => {
  afterAll(cleanup);

  describe('SelectStableCoinDropdown with loading state:', () => {
    beforeEach(() => {
      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'idle');

      renderResult = renderSelectStableCoinDropdownWithProviders();
    });

    it('Show loaders', () => {
      expect(renderResult.queryByTestId('loader')).toBeVisible();
    });
  });

  describe('SelectStableCoinDropdown with disconnected state:', () => {
    beforeEach(() => {
      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');

      renderResult = renderSelectStableCoinDropdownWithProviders();
    });

    it('Show loaders', () => {
      expect(renderResult.queryByTestId('loader')).toBeVisible();
    });
  });

  describe('SelectStableCoinDropdown with connected state:', () => {
    beforeEach(() => {
      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');
      jest.mocked(useCurrentAccount).mockImplementation(createMockAccount);

      renderResult = renderSelectStableCoinDropdownWithProviders();
    });

    it('Show StableCoin list loader', () => {
      expect(renderResult.queryByTestId('loader')).toBeVisible();
    });
  });

  describe('SelectStableCoinDropdown with StableCoin list:', () => {
    beforeEach(() => {
      const domain = 'https://localhost:3001';
      const url = new URL(`${domain}/dashboard/operations?${qs.stringify({
        txid: TEST_STABLE_COIN1.txid,
      })}`);

      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');
      jest.mocked(useCurrentAccount).mockImplementation(createMockAccount);
      jest.mocked(useStableCoinsList).mockImplementation(
        createMockStableCoinList()
      );
      jest.mocked(usePathname).mockImplementation(() => url.pathname);
      jest.mocked(useSearchParams).mockImplementation(() => (
        new URLSearchParams(url.search)
      ) as ReadonlyURLSearchParams);

      renderResult = renderSelectStableCoinDropdownWithProviders();
    });

    it('Show selected StableCoin', () => {
      expect(renderResult.queryByText(new RegExp(TEST_STABLE_COIN1.ticker as string))).toBeVisible();
    });

    it('Show StableCoin list', async () => {
      const user = userEvent.setup();

      const dropdownButton = renderResult.getByRole('button', {
        name: new RegExp(TEST_STABLE_COIN1.ticker as string),
      });

      await user.click(dropdownButton);

      expect(renderResult.queryAllByText(new RegExp(TEST_STABLE_COIN1.ticker as string)).length).toBe(2);
      expect(renderResult.queryByText(new RegExp(TEST_STABLE_COIN2.ticker as string))).toBeVisible();
    });

    it('Snapshot', () => {
      expect(renderResult.container).toMatchSnapshot();
    });
  });
});
