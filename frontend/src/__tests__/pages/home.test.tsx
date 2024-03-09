import { render } from '@testing-library/react';

import '@testing-library/jest-dom';

import HomePage from '@/app/home/page';

describe('Home page', () => {
  it('renders Home page', () => {
    const { container } = render(<HomePage />);

    expect(container).toMatchSnapshot();
  });
});
