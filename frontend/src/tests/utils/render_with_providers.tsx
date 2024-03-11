import { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';

import { Providers } from '@/app/providers';

export const renderWithProviders = (
  ui: ReactNode,
  options?: Omit<RenderOptions, 'queries'>
) => render(
  <Providers>
    {ui}
  </Providers>,
  options
);
