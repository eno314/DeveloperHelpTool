/**
 * @jest-environment jsdom
 */

import React from 'react';
import {render, screen} from '@testing-library/react';
import Base64Encode from './page';
import '@testing-library/jest-dom';

describe('Base64 Encode Page', () => {
  it('renders DeveloperHelpToolFrame and subTitle', () => {
    render(<Base64Encode />);
    expect(
      screen.getByText('Base64 Encode And Decode Tool'),
    ).toBeInTheDocument();
    expect(screen.getByText('Developer Help Tool')).toBeInTheDocument();
  });
});
