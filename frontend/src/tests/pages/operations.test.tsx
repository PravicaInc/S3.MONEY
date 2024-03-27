import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { cleanup, RenderResult } from '@testing-library/react';

import '@testing-library/jest-dom';

import OperationsPage from '@/app/dashboard/operations/page';

import { createMockAccount } from '@/tests/utils/create_mock_wallet_account';
import { renderWithProviders } from '@/tests/utils/render_with_providers';

const renderSignInPageWithProviders = () => renderWithProviders(<OperationsPage />);

let renderResult: RenderResult;

describe('Operations page:', () => {
  afterAll(cleanup);

  describe('Operations page with connected state:', () => {
    beforeEach(() => {
      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');
      jest.mocked(useCurrentAccount).mockImplementation(createMockAccount);

      renderResult = renderSignInPageWithProviders();
    });

    it('Snapshot', () => {
      expect(renderResult.container).toMatchSnapshot();
    });
  });
});
