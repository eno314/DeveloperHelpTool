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
    expect(screen.getByText('Local Time')).toBeInTheDocument();
    expect(screen.getByText('UTC (GMT)')).toBeInTheDocument();
    expect(screen.getByLabelText('Select timezone')).toBeInTheDocument();
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

  it('copies the formatted time when a row copy button is clicked', async () => {
    // Mock the date to a specific value
    const mockDate = new Date('2023-01-01T12:00:00Z');
    jest.setSystemTime(mockDate);

    render(<TimestampTool />);

    act(() => {
      jest.advanceTimersByTime(10);
    });

    const copyUtcButton = screen.getByLabelText('Copy time for UTC (GMT)');
    expect(copyUtcButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(copyUtcButton);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      '2023-01-01 12:00:00',
    );
    expect(copyUtcButton).toHaveTextContent('Copied!');

    // Advance timer to see it revert
    await act(async () => {
      jest.advanceTimersByTime(2500);
    });

    expect(copyUtcButton).toHaveTextContent('Copy');
  });

  it('shows selected timezone time and allows copying', async () => {
    const mockDate = new Date('2023-01-01T12:00:00Z');
    jest.setSystemTime(mockDate);

    render(<TimestampTool />);

    act(() => {
      jest.advanceTimersByTime(10);
    });

    const select = screen.getByLabelText('Select timezone');

    // Initially the copy button for the select row shouldn't exist
    expect(
      screen.queryByLabelText('Copy time for selected timezone'),
    ).not.toBeInTheDocument();

    // Select Japan
    await act(async () => {
      fireEvent.change(select, {target: {value: 'Asia/Tokyo'}});
    });

    // Now the time and copy button should exist
    expect(screen.getByText('2023-01-01 21:00:00')).toBeInTheDocument();

    const copySelectedBtn = screen.getByLabelText(
      'Copy time for selected timezone',
    );
    expect(copySelectedBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(copySelectedBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      '2023-01-01 21:00:00',
    );
  });
});
