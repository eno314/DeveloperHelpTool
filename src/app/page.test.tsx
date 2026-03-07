import React from 'react';
import {render, screen} from '@testing-library/react';
import Home from './page';
import '@testing-library/jest-dom';

describe('Home Page', () => {
  it('renders DeveloperHelpToolFrame and subTitle', () => {
    render(<Home />);
    expect(screen.getByText('index page')).toBeInTheDocument();
    expect(screen.getByText('Developer Help Tool')).toBeInTheDocument();
  });

  it('renders ToolList links', () => {
    render(<Home />);
    expect(screen.getByText('JSON Parse Tool')).toBeInTheDocument();
    expect(screen.getByText('String Replace Tool')).toBeInTheDocument();
    expect(screen.getByText('Url Encode And Decode Tool')).toBeInTheDocument();
    expect(screen.getByText('Url Parse Tool')).toBeInTheDocument();
  });
});
