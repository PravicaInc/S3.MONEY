import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { cleanup, RenderResult } from '@testing-library/react';

import '@testing-library/jest-dom';

import HomePage from '@/app/home/page';

import { createMockAccount } from '@/tests/utils/create_mock_wallet_account';
import { renderWithProviders } from '@/tests/utils/render_with_providers';

const renderHomePageWithProviders = () => renderWithProviders(<HomePage />);

let renderResult: RenderResult;

describe('Home page:', () => {
  afterAll(cleanup);

  describe('Home page with connected state:', () => {
    beforeEach(() => {
      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');
      jest.mocked(useCurrentAccount).mockImplementation(createMockAccount);

      renderResult = renderHomePageWithProviders();
    });

    it('Show stablecoin form', () => {
      expect(renderResult.queryByText('Select Stablecoin')).toBeVisible();
    });

    it('Snapshot', () => {
      expect(renderResult.container).toMatchSnapshot();
    });
  });
});
