import { render } from '@testing-library/react';

import '@testing-library/jest-dom';

import { Header } from '@/Components/Header';

describe('Header', () => {
  it('renders a Header', () => {
    const { container } = render(<Header />);

    expect(container).toMatchSnapshot();
  });
});
