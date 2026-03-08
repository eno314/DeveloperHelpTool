import React from 'react';
import {render, screen} from '@testing-library/react';
import JSONComparePage from './page';
import '@testing-library/jest-dom';

describe('JSON Compare Page', () => {
  it('renders DeveloperHelpToolFrame and subTitle', () => {
    render(<JSONComparePage />);
    expect(screen.getByText('JSON Compare Tool')).toBeInTheDocument();
    expect(screen.getByText('Developer Help Tool')).toBeInTheDocument();
  });

  it('renders JSONCompareForm', () => {
    render(<JSONComparePage />);
    expect(screen.getByLabelText('Left JSON')).toBeInTheDocument();
    expect(screen.getByLabelText('Right JSON')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Compare'})).toBeInTheDocument();
  });
});
