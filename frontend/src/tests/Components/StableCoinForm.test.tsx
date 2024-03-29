import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { act, cleanup, fireEvent, getQueriesForElement, RenderResult } from '@testing-library/react';

import '@testing-library/jest-dom';

import { SelectStableCoinForm } from '@/Components/SelectStableCoinForm';

import { useStableCoinsList } from '@/hooks/useStableCoinsList';

import {
  createMockStableCoinList,
  TEST_STABLE_COIN1,
  TEST_STABLE_COIN2,
} from '@/tests/utils/create_mock_stable_coin_list';
import { createMockAccount } from '@/tests/utils/create_mock_wallet_account';
import { renderWithProviders } from '@/tests/utils/render_with_providers';

const renderSelectStableCoinFormWithProviders = () => renderWithProviders(<SelectStableCoinForm />);

let renderResult: RenderResult;

describe('SelectStableCoinForm:', () => {
  afterAll(cleanup);

  describe('SelectStableCoinForm with loading state:', () => {
    beforeEach(() => {
      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'idle');

      renderResult = renderSelectStableCoinFormWithProviders();
    });

    it('Show loaders', () => {
      expect(renderResult.queryAllByTestId('loader').length).toBe(2);
    });
  });

  describe('SelectStableCoinForm with disconnected state:', () => {
    beforeEach(() => {
      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');

      renderResult = renderSelectStableCoinFormWithProviders();
    });

    it('Show loaders', () => {
      expect(renderResult.queryAllByTestId('loader').length).toBe(2);
    });
  });

  describe('SelectStableCoinForm with connected state:', () => {
    beforeEach(() => {
      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');
      jest.mocked(useCurrentAccount).mockImplementation(createMockAccount);

      renderResult = renderSelectStableCoinFormWithProviders();
    });

    it('Don`t show loaders instead of the StableCoin creation link', () => {
      expect(renderResult.queryByText(/New Stablecoin/)).toBeVisible();
    });

    it('Show StableCoin list loader', () => {
      expect(renderResult.queryByTestId('loader')).toBeVisible();
    });
  });

  describe('SelectStableCoinForm with StableCoin list:', () => {
    beforeEach(() => {
      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');
      jest.mocked(useCurrentAccount).mockImplementation(createMockAccount);
      jest.mocked(useStableCoinsList).mockImplementation(
        createMockStableCoinList()
      );

      renderResult = renderSelectStableCoinFormWithProviders();
    });

    it('Show StableCoin list', () => {
      expect(renderResult.queryByTestId('loader')).toBeNull();
      expect(renderResult.queryByText(TEST_STABLE_COIN1.ticker as string)).toBeVisible();
      expect(renderResult.queryByText(TEST_STABLE_COIN2.ticker as string)).toBeVisible();
    });

    it('Show filtered StableCoin list', () => {
      const searchInput = renderResult.getByPlaceholderText(/Search/);

      fireEvent.change(searchInput, { target: { value: TEST_STABLE_COIN2.ticker as string } });

      expect(renderResult.queryByText(TEST_STABLE_COIN1.ticker as string)).toBeNull();
      expect(renderResult.queryByText(TEST_STABLE_COIN2.ticker as string)).toBeVisible();

      fireEvent.change(searchInput, { target: { value: '' } });

      expect(renderResult.queryByText(TEST_STABLE_COIN1.ticker as string)).toBeVisible();
      expect(renderResult.queryByText(TEST_STABLE_COIN2.ticker as string)).toBeVisible();
    });

    it('Select StableCoin', () => {
      const buttonStableCoin1 = renderResult.getByRole('button', {
        name: new RegExp(TEST_STABLE_COIN1.ticker as string),
      });
      const buttonStableCoin2 = renderResult.getByRole('button', {
        name: new RegExp(TEST_STABLE_COIN2.ticker as string),
      });

      act(() => {
        buttonStableCoin1.click();
      });

      expect(
        (getQueriesForElement(buttonStableCoin1).queryByRole('checkbox') as HTMLInputElement)?.checked
      ).toBeTruthy();

      act(() => {
        buttonStableCoin2.click();
      });

      expect(
        (getQueriesForElement(buttonStableCoin1).queryByRole('checkbox') as HTMLInputElement)?.checked
      ).toBeFalsy();
      expect(
        (getQueriesForElement(buttonStableCoin2).queryByRole('checkbox') as HTMLInputElement)?.checked
      ).toBeTruthy();
    });

    it('Unselect StableCoin if it has been filtered', () => {
      const buttonStableCoin1 = renderResult.getByRole('button', {
        name: new RegExp(TEST_STABLE_COIN1.ticker as string),
      });
      const searchInput = renderResult.getByPlaceholderText(/Search/);

      act(() => {
        buttonStableCoin1.click();
      });

      fireEvent.change(searchInput, { target: { value: TEST_STABLE_COIN2.ticker as string } });
      fireEvent.change(searchInput, { target: { value: '' } });

      expect(
        (getQueriesForElement(renderResult.getByRole('button', {
          name: new RegExp(TEST_STABLE_COIN1.ticker as string),
        })).queryByRole('checkbox') as HTMLInputElement)?.checked
      ).toBeFalsy();
    });

    it('Disabled and enabled manage stablecoin button', () => {
      const getManageStableCoinButton = () => renderResult.getByText('Manage Stablecoin') as HTMLButtonElement;
      const buttonStableCoin1 = renderResult.getByRole('button', {
        name: new RegExp(TEST_STABLE_COIN1.ticker as string),
      });
      const searchInput = renderResult.getByPlaceholderText(/Search/);

      expect(getManageStableCoinButton()?.disabled).toBeTruthy();

      act(() => {
        buttonStableCoin1.click();
      });

      expect(getManageStableCoinButton()?.disabled).toBeFalsy();

      fireEvent.change(searchInput, { target: { value: TEST_STABLE_COIN1.ticker as string } });

      expect(getManageStableCoinButton()?.disabled).toBeFalsy();

      fireEvent.change(searchInput, { target: { value: TEST_STABLE_COIN2.ticker as string } });

      expect(getManageStableCoinButton()?.disabled).toBeTruthy();

      fireEvent.change(searchInput, { target: { value: '' } });

      expect(getManageStableCoinButton()?.disabled).toBeTruthy();
    });

    it('Snapshot', () => {
      expect(renderResult.container).toMatchSnapshot();
    });
  });
});
