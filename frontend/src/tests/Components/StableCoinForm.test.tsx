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
      expect(renderResult.queryByText(TEST_STABLE_COIN1.name)).toBeVisible();
      expect(renderResult.queryByText(TEST_STABLE_COIN2.name)).toBeVisible();
    });

    it('Show filtered StableCoin list', () => {
      const searchInput = renderResult.getByPlaceholderText(/Search/);

      fireEvent.change(searchInput, { target: { value: TEST_STABLE_COIN2.name } });

      expect(renderResult.queryByText(TEST_STABLE_COIN1.name)).toBeNull();
      expect(renderResult.queryByText(TEST_STABLE_COIN2.name)).toBeVisible();

      fireEvent.change(searchInput, { target: { value: '' } });

      expect(renderResult.queryByText(TEST_STABLE_COIN1.name)).toBeVisible();
      expect(renderResult.queryByText(TEST_STABLE_COIN2.name)).toBeVisible();
    });

    it('Select StableCoin', () => {
      const buttonStableCoin1 = renderResult.getByRole('button', {
        name: new RegExp(TEST_STABLE_COIN1.name),
      });
      const buttonStableCoin2 = renderResult.getByRole('button', {
        name: new RegExp(TEST_STABLE_COIN2.name),
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
        name: new RegExp(TEST_STABLE_COIN1.name),
      });
      const searchInput = renderResult.getByPlaceholderText(/Search/);

      act(() => {
        buttonStableCoin1.click();
      });

      fireEvent.change(searchInput, { target: { value: TEST_STABLE_COIN2.name } });
      fireEvent.change(searchInput, { target: { value: '' } });

      expect(
        (getQueriesForElement(renderResult.getByRole('button', {
          name: new RegExp(TEST_STABLE_COIN1.name),
        })).queryByRole('checkbox') as HTMLInputElement)?.checked
      ).toBeFalsy();
    });

    it('Disabled and enabled manage stablecoin button', () => {
      const manageStablecoinButton = renderResult.getByText('Manage Stablecoin') as HTMLButtonElement;
      const buttonStableCoin1 = renderResult.getByRole('button', {
        name: new RegExp(TEST_STABLE_COIN1.name),
      });
      const searchInput = renderResult.getByPlaceholderText(/Search/);

      expect(manageStablecoinButton?.disabled).toBeTruthy();

      act(() => {
        buttonStableCoin1.click();
      });

      expect(manageStablecoinButton?.disabled).toBeFalsy();

      fireEvent.change(searchInput, { target: { value: TEST_STABLE_COIN1.name } });

      expect(manageStablecoinButton?.disabled).toBeFalsy();

      fireEvent.change(searchInput, { target: { value: TEST_STABLE_COIN2.name } });

      expect(manageStablecoinButton?.disabled).toBeTruthy();

      fireEvent.change(searchInput, { target: { value: '' } });

      expect(manageStablecoinButton?.disabled).toBeTruthy();
    });

    it('Snapshot', () => {
      expect(renderResult.container).toMatchSnapshot();
    });
  });
});
