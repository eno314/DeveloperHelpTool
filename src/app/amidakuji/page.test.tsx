import React from 'react';
import {render, screen} from '@testing-library/react';
import AmidakujiPage from './page';
import '@testing-library/jest-dom';

describe('AmidakujiPage', () => {
  it('renders without crashing', () => {
    render(<AmidakujiPage />);
    expect(screen.getByText('Amidakuji Tool')).toBeInTheDocument();
  });
});
