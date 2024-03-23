import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { cleanup, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom';

import { SupplyTypes } from '@/app/create-stablecoin/components/SupplyDetails';
import CreateStablecoinPage from '@/app/create-stablecoin/page';

import { createMockAccount } from '@/tests/utils/create_mock_wallet_account';
import { renderWithProviders } from '@/tests/utils/render_with_providers';

const renderCreateStablecoinPageWithProviders = () => renderWithProviders(<CreateStablecoinPage />);

let renderResult: RenderResult;

describe('Create stablecoin page:', () => {
  afterAll(cleanup);

  describe('Create stablecoin page with loading state:', () => {
    beforeEach(() => {
      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'idle');

      renderResult = renderCreateStablecoinPageWithProviders();
    });

    it('Show loader', () => {
      expect(renderResult.queryByTestId('loader')).toBeVisible();
    });
  });

  describe('Create stablecoin page with disconnected state:', () => {
    beforeEach(() => {
      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');

      renderResult = renderCreateStablecoinPageWithProviders();
    });

    it('Show loader', () => {
      expect(renderResult.queryByTestId('loader')).toBeVisible();
    });
  });

  describe('Create stablecoin page with connected state:', () => {
    describe('"Initial Details" step:', () => {
      beforeEach(() => {
        if (renderResult?.unmount) {
          renderResult.unmount();
        }

        jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');
        jest.mocked(useCurrentAccount).mockImplementation(createMockAccount);

        renderResult = renderCreateStablecoinPageWithProviders();
      });

      it('Snapshot', () => {
        expect(renderResult.container).toMatchSnapshot();
      });

      it('Check Stablecoin Name validation', async () => {
        const testValue = '1234567890qwertyuiopasdfghjklzxcvbnm';

        const user = userEvent.setup();
        const nextButton = renderResult.getByRole('button', {
          name: /Next/i,
        });
        const stablecoinNameField = renderResult.getByPlaceholderText('Stablecoin Name');

        await user.click(nextButton);

        expect(renderResult.queryByText(/name is required/)).toBeVisible();

        await user.type(stablecoinNameField, testValue);

        expect(renderResult.queryByDisplayValue(testValue)).toBeNull();
        expect(renderResult.getByDisplayValue(testValue.substring(0, 28))).toBeVisible();

        await user.clear(stablecoinNameField);

        expect(renderResult.queryByText(/name is required/)).toBeVisible();
      });

      it('Check Stablecoin Ticker validation', async () => {
        const testValue = '1!) qwerty';

        const user = userEvent.setup();
        const nextButton = renderResult.getByRole('button', {
          name: /Next/i,
        });
        const stablecoinTickerField = renderResult.getByPlaceholderText('Stablecoin Ticker');

        await user.click(nextButton);

        expect(renderResult.queryByText(/ticker is required/)).toBeVisible();

        await user.type(stablecoinTickerField, testValue);

        expect(renderResult.queryByDisplayValue(testValue)).toBeNull();
        expect(renderResult.getByDisplayValue('$QWERT')).toBeVisible();

        await user.clear(stablecoinTickerField);

        expect(renderResult.getByDisplayValue('$')).toBeVisible();
        expect(renderResult.queryByText(/ticker is required/)).toBeVisible();
      });

      it('Go to "Supply Details" step', async () => {
        await goToSupplyDetailsStep();

        expect(renderResult.queryAllByText(/Supply Details/).length).toBe(2);
      });
    });

    describe('"Supply Details" step:', () => {
      beforeEach(async () => {
        if (renderResult?.unmount) {
          renderResult.unmount();
        }

        jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');
        jest.mocked(useCurrentAccount).mockImplementation(createMockAccount);

        renderResult = renderCreateStablecoinPageWithProviders();

        await goToSupplyDetailsStep();
      });

      it('Snapshot', () => {
        expect(renderResult.container).toMatchSnapshot();
      });

      it('Check Initial Supply validation', async () => {
        const user = userEvent.setup();
        const nextButton = renderResult.getByRole('button', {
          name: /Next/i,
        });
        const initialSupplyField = renderResult.getByPlaceholderText('Initial Supply');

        await user.click(nextButton);

        expect(renderResult.queryByText(/Initial Supply is required/)).toBeVisible();

        await user.type(initialSupplyField, '!@#,.-asds');

        expect(renderResult.queryByDisplayValue('0')).toBeVisible();

        await user.type(initialSupplyField, '123456789');

        expect(renderResult.queryByDisplayValue('123,456,789')).toBeVisible();

        await user.clear(initialSupplyField);

        expect(renderResult.queryByText(/Initial Supply is required/)).toBeVisible();
      });

      it('Check Max Supply validation', async () => {
        const user = userEvent.setup();
        const nextButton = renderResult.getByRole('button', {
          name: /Next/i,
        });
        const supplySelect = renderResult.getByRole('combobox');

        await user.selectOptions(supplySelect, SupplyTypes.Finite);

        const maxSupplyField = renderResult.getByPlaceholderText('Max Supply');

        await user.click(nextButton);

        expect(renderResult.queryByText(/Max Supply is required/)).toBeVisible();

        await user.type(maxSupplyField, '!@#,.-asds');

        expect(renderResult.queryByDisplayValue('0')).toBeVisible();

        await user.type(maxSupplyField, '123456789');

        expect(renderResult.queryByDisplayValue('123,456,789')).toBeVisible();
        expect(renderResult.queryByText(/The maximum supply should be more than the initial supply/)).toBeVisible();

        await user.clear(maxSupplyField);

        expect(renderResult.queryByText(/Max Supply is required/)).toBeVisible();
      });

      it('Check Decimals validation', async () => {
        const user = userEvent.setup();
        const nextButton = renderResult.getByRole('button', {
          name: /Next/i,
        });
        const decimalsField = renderResult.getByPlaceholderText('Decimals');

        await user.click(nextButton);

        expect(renderResult.queryByText(/Decimals is required/)).toBeVisible();

        await user.type(decimalsField, '!@#,.-asds');

        expect(renderResult.queryByDisplayValue('0')).toBeVisible();

        await user.type(decimalsField, '123456789');

        expect(renderResult.queryByDisplayValue('123,456,789')).toBeVisible();
        expect(renderResult.queryByText(/Decimals can be up to 16/)).toBeVisible();

        await user.clear(decimalsField);

        expect(renderResult.queryByText(/Decimals is required/)).toBeVisible();
      });

      it('Go to "Permissions" step', async () => {
        await goToPermissionsStep();

        expect(renderResult.queryByText(/Assign Default Permissions/)).toBeVisible();
      });
    });

    describe('"Permissions" step:', () => {
      beforeEach(async () => {
        if (renderResult?.unmount) {
          renderResult.unmount();
        }

        jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');
        jest.mocked(useCurrentAccount).mockImplementation(createMockAccount);

        renderResult = renderCreateStablecoinPageWithProviders();

        await goToSupplyDetailsStep();
        await goToPermissionsStep();
      });

      it('Snapshot', () => {
        expect(renderResult.container).toMatchSnapshot();
      });

      it('Show a hint that this feature is coming soon', async () => {
        const user = userEvent.setup();
        const permissionsSwitch = renderResult.getByRole('checkbox');

        await user.hover(permissionsSwitch);

        expect(renderResult.queryByText(/Editing to permissions will be available soon/)).toBeVisible();
      });

      it('Go to "Roles Assignment"', async () => {
        await goToRolesAssignmentStep();

        expect(renderResult.queryAllByText(/Roles Assignment/).length).toBe(2);
      });
    });

    describe('"Roles Assignment" step:', () => {
      beforeEach(async () => {
        if (renderResult?.unmount) {
          renderResult.unmount();
        }

        jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');
        jest.mocked(useCurrentAccount).mockImplementation(createMockAccount);

        renderResult = renderCreateStablecoinPageWithProviders();

        await goToSupplyDetailsStep();
        await goToPermissionsStep();
        await goToRolesAssignmentStep();
      });

      it('Snapshot', () => {
        expect(renderResult.container).toMatchSnapshot();
      });

      it('Check wallet address validation', async () => {
        const user = userEvent.setup();
        const otherAccountButton = renderResult.queryAllByText(/Other Account/)[0];
        const createButton = renderResult.getByRole('button', {
          name: /Create/i,
        });

        await user.click(otherAccountButton);
        await user.click(createButton);

        expect(renderResult.queryByText(/Wallet address is required/)).toBeVisible();

        const otherAccountInput = renderResult.getAllByPlaceholderText(/Other Account/)[0];

        await user.type(otherAccountInput, 'test');

        expect(renderResult.queryByText(/Wallet address is incorrect/)).toBeVisible();

        const currentAccountButton = renderResult.queryAllByText(/Current Account/)[0];

        await user.click(currentAccountButton);
        await user.click(createButton);

        expect(renderResult.queryByText(/Token Details Review Confirmation/)).toBeVisible();
        expect(renderResult.queryByText(/Wallet address is required/)).toBeNull();
        expect(renderResult.queryByText(/Wallet address is incorrect/)).toBeNull();
      });

      it('Show Token Details Review Confirmation', async () => {
        const user = userEvent.setup();
        const createButton = renderResult.getByRole('button', {
          name: /Create/i,
        });

        await user.click(createButton);

        expect(renderResult.queryByText(/Token Details Review Confirmation/)).toBeVisible();
      });
    });
  });
});

async function goToSupplyDetailsStep() {
  const user = userEvent.setup();
  const nextButton = renderResult.getByRole('button', {
    name: /Next/i,
  });
  const stablecoinNameField = renderResult.getByPlaceholderText('Stablecoin Name');
  const stablecoinTickerField = renderResult.getByPlaceholderText('Stablecoin Ticker');

  await user.type(stablecoinNameField, 'TEST COIN');
  await user.type(stablecoinTickerField, 'ts');
  await user.click(nextButton);
}

async function goToPermissionsStep() {
  const user = userEvent.setup();
  const nextButton = renderResult.getByRole('button', {
    name: /Next/i,
  });
  const initialSupplyField = renderResult.getByPlaceholderText('Initial Supply');
  const supplySelect = renderResult.getByRole('combobox');
  const decimalsField = renderResult.getByPlaceholderText('Decimals');

  await user.selectOptions(supplySelect, SupplyTypes.Finite);

  const maxSupplyField = renderResult.getByPlaceholderText('Max Supply');

  await user.type(maxSupplyField, '123456789');
  await user.type(initialSupplyField, '987');
  await user.type(decimalsField, '7');
  await user.click(nextButton);
}

async function goToRolesAssignmentStep() {
  const user = userEvent.setup();
  const nextButton = renderResult.getByRole('button', {
    name: /Next/i,
  });

  await user.click(nextButton);
}
