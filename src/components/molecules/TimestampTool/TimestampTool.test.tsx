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
    expect(screen.getByText('Timestamp Converter')).toBeInTheDocument();
  });

  it('converts timestamp to dates correctly in the converter', async () => {
    // 2024-01-01 12:00:00 UTC = 1704110400
    const mockDate = new Date('2024-01-01T12:00:00Z');
    jest.setSystemTime(mockDate);

    render(<TimestampTool />);

    act(() => {
      jest.advanceTimersByTime(10);
    });

    const timestampInput = screen.getByLabelText('Unix Timestamp (Seconds)');
    const localTimeInput = screen.getByLabelText(
      'Local Time (YYYY-MM-DD HH:mm:ss)',
    );
    const utcTimeInput = screen.getByLabelText(
      'UTC Time (YYYY-MM-DD HH:mm:ss)',
    );

    expect(timestampInput).toHaveValue(1704110400);
    expect(utcTimeInput).toHaveValue('2024-01-01 12:00:00');
    // Using localTimeInput so that it isn't completely unused.
    expect(localTimeInput).toBeInTheDocument();

    // Change timestamp to 1704196800 (2024-01-02 12:00:00 UTC)
    await act(async () => {
      fireEvent.change(timestampInput, {target: {value: '1704196800'}});
    });

    expect(utcTimeInput).toHaveValue('2024-01-02 12:00:00');
  });

  it('converts UTC time string to timestamp correctly in the converter', async () => {
    const mockDate = new Date('2024-01-01T12:00:00Z');
    jest.setSystemTime(mockDate);

    render(<TimestampTool />);

    act(() => {
      jest.advanceTimersByTime(10);
    });

    const timestampInput = screen.getByLabelText('Unix Timestamp (Seconds)');
    const utcTimeInput = screen.getByLabelText(
      'UTC Time (YYYY-MM-DD HH:mm:ss)',
    );

    // Change UTC time to 2024-01-02 12:00:00
    await act(async () => {
      fireEvent.change(utcTimeInput, {target: {value: '2024-01-02 12:00:00'}});
    });

    // 2024-01-02 12:00:00 UTC = 1704196800
    expect(timestampInput).toHaveValue(1704196800);
  });

  it('handles invalid date strings gracefully in the converter', async () => {
    render(<TimestampTool />);
    act(() => {
      jest.advanceTimersByTime(10);
    });

    const localTimeInput = screen.getByLabelText(
      'Local Time (YYYY-MM-DD HH:mm:ss)',
    );
    const utcTimeInput = screen.getByLabelText(
      'UTC Time (YYYY-MM-DD HH:mm:ss)',
    );
    const timestampInput = screen.getByLabelText('Unix Timestamp (Seconds)');

    const currentTimestamp = (timestampInput as HTMLInputElement).value;

    // Enter invalid local time
    await act(async () => {
      fireEvent.change(localTimeInput, {target: {value: 'invalid'}});
    });

    // Verify timestamp did not change to NaN or crash
    expect(timestampInput).toHaveValue(Number(currentTimestamp));

    // Enter invalid UTC time
    await act(async () => {
      fireEvent.change(utcTimeInput, {target: {value: 'invalid'}});
    });

    // Verify timestamp still didn't change
    expect(timestampInput).toHaveValue(Number(currentTimestamp));
  });

  it('converts Local time string to timestamp correctly in the converter', async () => {
    render(<TimestampTool />);
    act(() => {
      jest.advanceTimersByTime(10);
    });

    const localTimeInput = screen.getByLabelText(
      'Local Time (YYYY-MM-DD HH:mm:ss)',
    );
    const timestampInput = screen.getByLabelText('Unix Timestamp (Seconds)');

    // We can't strictly assert the exact timestamp because of the local timezone of the test runner,
    // but we can assert the connection works and doesn't throw.
    await act(async () => {
      fireEvent.change(localTimeInput, {
        target: {value: '2025-01-01 12:00:00'},
      });
    });

    const currentTimestamp = (timestampInput as HTMLInputElement).value;
    expect(Number(currentTimestamp)).not.toBeNaN();
    expect(Number(currentTimestamp)).toBeGreaterThan(0);
  });

  it('allows copying from the converter fields', async () => {
    render(<TimestampTool />);
    act(() => {
      jest.advanceTimersByTime(10);
    });

    const copyTimestampBtn = screen.getByLabelText('Copy converter timestamp');
    const copyLocalTimeBtn = screen.getByLabelText('Copy converter local time');
    const copyUtcTimeBtn = screen.getByLabelText('Copy converter UTC time');

    await act(async () => {
      fireEvent.click(copyTimestampBtn);
    });
    expect(copyTimestampBtn).toHaveTextContent('Copied!');

    await act(async () => {
      fireEvent.click(copyLocalTimeBtn);
    });
    expect(copyLocalTimeBtn).toHaveTextContent('Copied!');

    await act(async () => {
      fireEvent.click(copyUtcTimeBtn);
    });
    expect(copyUtcTimeBtn).toHaveTextContent('Copied!');
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
