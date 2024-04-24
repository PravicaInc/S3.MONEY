import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { cleanup, RenderResult } from '@testing-library/react';
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation';

import '@testing-library/jest-dom';

import HomePage from '@/app/home/page';

import { useStableCoinsList } from '@/hooks/useStableCoinsList';

import { createMockStableCoinList } from '@/tests/utils/create_mock_stable_coin_list';
import { createMockAccount } from '@/tests/utils/create_mock_wallet_account';
import { renderWithProviders } from '@/tests/utils/render_with_providers';

const renderHomePageWithProviders = () => renderWithProviders(<HomePage />);

let renderResult: RenderResult;

describe('Home page:', () => {
  afterAll(cleanup);

  describe('Home page with connected state:', () => {
    beforeEach(() => {
      const domain = 'https://localhost:3001';
      const url = new URL(`${domain}/`);

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

      renderResult = renderHomePageWithProviders();
    });

    it('Snapshot', () => {
      expect(renderResult.container).toMatchSnapshot();
    });
  });
});
