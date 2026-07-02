// !STARTERCONF You should delete this page

import { render, screen } from '@testing-library/react';

import HomePage from '@/pages/index.page';

describe('Homepage', () => {
  it('renders the Components', () => {
    render(<HomePage />);

    const heading = screen.getByText(/Home/i);

    expect(heading).toBeInTheDocument();
  });
});
