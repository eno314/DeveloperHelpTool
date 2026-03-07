import React from 'react';
import {render, screen} from '@testing-library/react';
import StringReplace from './page';
import '@testing-library/jest-dom';

describe('String Replace Page', () => {
  it('renders DeveloperHelpToolFrame and subTitle', () => {
    render(<StringReplace />);
    expect(screen.getByText('String Replace Tool')).toBeInTheDocument();
    expect(screen.getByText('Developer Help Tool')).toBeInTheDocument();
  });
});
