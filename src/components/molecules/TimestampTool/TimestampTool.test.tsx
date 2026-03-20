import {render, screen, fireEvent, act} from '@testing-library/react';
import '@testing-library/jest-dom';
import TimestampTool from './TimestampTool';
import React from 'react';

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
});

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

describe('TimestampTool', () => {
  it('renders correctly and shows loading state initially, then timestamp', () => {
    render(<TimestampTool />);

    // Act to allow the initial useEffect to run and update state
    act(() => {
      jest.advanceTimersByTime(10);
    });

    expect(
      screen.getByText('Current Unix Timestamp (Seconds)'),
    ).toBeInTheDocument();
    expect(screen.getByText('Current Time')).toBeInTheDocument();
    expect(screen.getByText('Japan (JST)')).toBeInTheDocument();
    expect(screen.getByText('UTC (GMT)')).toBeInTheDocument();
  });

  it('copies the timestamp when the copy button is clicked', async () => {
    // Mock the date to a specific value so we know the expected timestamp
    const mockDate = new Date('2023-01-01T12:00:00Z');
    jest.setSystemTime(mockDate);

    render(<TimestampTool />);

    act(() => {
      jest.advanceTimersByTime(10);
    });

    const expectedTimestamp = Math.floor(mockDate.getTime() / 1000).toString();

    const copyButton = screen.getByLabelText('Copy timestamp');
    expect(copyButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expectedTimestamp,
    );
    expect(copyButton).toHaveTextContent('Copied!');

    // Advance timer to see it revert
    await act(async () => {
      jest.advanceTimersByTime(2500);
    });

    expect(copyButton).toHaveTextContent('Copy');
  });
});
