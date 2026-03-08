import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import CurlBuilderForm from './CurlBuilderForm';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('CurlBuilderForm', () => {
  beforeEach(() => {
    (navigator.clipboard.writeText as jest.Mock).mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders initial state correctly', () => {
    render(<CurlBuilderForm />);

    expect(screen.getByLabelText('Method')).toBeInTheDocument();
    expect(screen.getByDisplayValue('GET')).toBeInTheDocument();

    expect(screen.getByLabelText('URL')).toBeInTheDocument();
    expect(screen.queryByLabelText('Body')).not.toBeInTheDocument();

    expect(screen.getByText('No headers added.')).toBeInTheDocument();

    const output = screen.getByDisplayValue('curl ""');
    expect(output).toBeInTheDocument();
  });

  it('updates curl command when URL is changed', () => {
    render(<CurlBuilderForm />);

    const urlInput = screen.getByPlaceholderText(
      'https://example.com/api?query=1',
    );
    fireEvent.change(urlInput, {
      target: {value: 'https://api.github.com/users'},
    });

    expect(
      screen.getByDisplayValue('curl "https://api.github.com/users"'),
    ).toBeInTheDocument();
  });

  it('updates curl command when method is changed to POST and body is added', () => {
    render(<CurlBuilderForm />);

    const urlInput = screen.getByPlaceholderText(
      'https://example.com/api?query=1',
    );
    fireEvent.change(urlInput, {target: {value: 'http://localhost/api'}});

    const methodSelect = screen.getByLabelText('Method');
    fireEvent.change(methodSelect, {target: {value: 'POST'}});

    expect(
      screen.getByDisplayValue('curl -X POST "http://localhost/api"'),
    ).toBeInTheDocument();

    const bodyTextarea = screen.getByPlaceholderText('Request Body');
    expect(bodyTextarea).toBeInTheDocument();

    fireEvent.change(bodyTextarea, {target: {value: '{"name": "test"}'}});

    expect(
      screen.getByDisplayValue(
        'curl -X POST "http://localhost/api" -d \'{"name": "test"}\'',
      ),
    ).toBeInTheDocument();
  });

  it('escapes single quotes in body', () => {
    render(<CurlBuilderForm />);

    const methodSelect = screen.getByLabelText('Method');
    fireEvent.change(methodSelect, {target: {value: 'POST'}});

    const bodyTextarea = screen.getByPlaceholderText('Request Body');
    fireEvent.change(bodyTextarea, {target: {value: "It's a test 'body'"}});

    expect(
      screen.getByDisplayValue(
        "curl -X POST \"\" -d 'It'\\''s a test '\\''body'\\'''",
      ),
    ).toBeInTheDocument();
  });

  it('adds, updates, and removes headers', () => {
    render(<CurlBuilderForm />);

    const addHeaderBtn = screen.getByText('+ Add Header');
    fireEvent.click(addHeaderBtn);

    expect(screen.queryByText('No headers added.')).not.toBeInTheDocument();

    const keyInput = screen.getByPlaceholderText('Key (e.g., Content-Type)');
    const valueInput = screen.getByPlaceholderText(
      'Value (e.g., application/json)',
    );

    fireEvent.change(keyInput, {target: {value: 'Content-Type'}});
    fireEvent.change(valueInput, {target: {value: 'application/json'}});

    expect(
      screen.getByDisplayValue('curl "" -H "Content-Type: application/json"'),
    ).toBeInTheDocument();

    const removeBtn = screen.getByRole('button', {name: 'Remove header'});
    fireEvent.click(removeBtn);

    expect(screen.getByText('No headers added.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('curl ""')).toBeInTheDocument();
  });

  it('copies command to clipboard and shows feedback', async () => {
    (navigator.clipboard.writeText as jest.Mock).mockResolvedValueOnce(
      undefined,
    );

    render(<CurlBuilderForm />);

    const urlInput = screen.getByPlaceholderText(
      'https://example.com/api?query=1',
    );
    fireEvent.change(urlInput, {target: {value: 'http://test.com'}});

    const copyBtn = screen.getByText('Copy');

    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'curl "http://test.com"',
    );
    expect(screen.getByText('Copied!')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByText('Copy')).toBeInTheDocument();
    expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
  });
});
