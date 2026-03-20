import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import TimestampPage from './page';
import React from 'react';

// Use fake timers to handle intervals inside TimestampTool
beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

describe('TimestampPage', () => {
  it('renders correctly', () => {
    render(<TimestampPage />);

    // Check if DeveloperHelpToolFrame is rendered correctly
    expect(screen.getByText('Developer Help Tool')).toBeInTheDocument();

    // Check if Timestamp Tool subtitle is rendered
    const subtitles = screen.getAllByText('Timestamp Tool');
    expect(subtitles.length).toBeGreaterThan(0);
  });
});
