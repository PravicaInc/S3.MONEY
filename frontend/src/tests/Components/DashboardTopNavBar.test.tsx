import { cleanup, RenderResult } from '@testing-library/react';
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation';
import qs from 'qs';

import '@testing-library/jest-dom';

import { DashboardTopNavBar } from '@/Components/DashboardTopNavBar';

import { TEST_STABLE_COIN1 } from '@/tests/utils/create_mock_stable_coin_list';
import { renderWithProviders } from '@/tests/utils/render_with_providers';

const renderDashboardTopNavBarWithProviders = () => renderWithProviders(<DashboardTopNavBar />);

let renderResult: RenderResult;

describe('DashboardTopNavBar:', () => {
  afterAll(cleanup);

  beforeEach(() => {
    if (renderResult?.unmount) {
      renderResult.unmount();
    }

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

    renderResult = renderDashboardTopNavBarWithProviders();
  });

  it('Snapshot', () => {
    expect(renderResult.container).toMatchSnapshot();
  });
});
