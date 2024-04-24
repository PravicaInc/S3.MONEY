import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { cleanup, RenderResult } from '@testing-library/react';
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation';
import qs from 'qs';

import '@testing-library/jest-dom';

import OperationsPage from '@/app/dashboard/operations/page';

import { useStableCoinsList } from '@/hooks/useStableCoinsList';

import { createMockStableCoinList, TEST_STABLE_COIN1 } from '@/tests/utils/create_mock_stable_coin_list';
import { createMockAccount } from '@/tests/utils/create_mock_wallet_account';
import { renderWithProviders } from '@/tests/utils/render_with_providers';

const renderSignInPageWithProviders = () => renderWithProviders(<OperationsPage />);

let renderResult: RenderResult;

describe('Operations page:', () => {
  afterAll(cleanup);

  describe('Operations page with connected state:', () => {
    beforeEach(() => {
      const domain = 'https://localhost:3001';
      const url = new URL(`${domain}/dashboard/operations?${qs.stringify({
        txid: TEST_STABLE_COIN1.txid,
      })}`);

      if (renderResult?.unmount) {
        renderResult.unmount();
      }

      jest.mocked(usePathname).mockImplementation(() => url.pathname);
      jest.mocked(useSearchParams).mockImplementation(() => (
        new URLSearchParams(url.search)
      ) as ReadonlyURLSearchParams);
      jest.mocked(useAutoConnectWallet).mockImplementation(() => 'attempted');
      jest.mocked(useCurrentAccount).mockImplementation(createMockAccount);
      jest.mocked(useStableCoinsList).mockImplementation(
        createMockStableCoinList()
      );

      renderResult = renderSignInPageWithProviders();
    });

    it('Snapshot', () => {
      expect(renderResult.container).toMatchSnapshot();
    });
  });
});
