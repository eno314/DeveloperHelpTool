import React from 'react';
import {render, screen} from '@testing-library/react';
import UrlEncode from './page';
import '@testing-library/jest-dom';

describe('Url Encode Page', () => {
  it('renders DeveloperHelpToolFrame and subTitle', () => {
    render(<UrlEncode />);
    expect(screen.getByText('Url Encode And Decode Tool')).toBeInTheDocument();
    expect(screen.getByText('Developer Help Tool')).toBeInTheDocument();
  });
});
