import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import EncodeDecodeForm from './EncodeDecodeForm';
import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder for jsdom
if (typeof global.TextEncoder === 'undefined') {
  const {TextEncoder, TextDecoder} = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}

describe('EncodeDecodeForm', () => {
  it('should render the form with URL mode by default', () => {
    render(<EncodeDecodeForm />);
    const select = screen.getByLabelText('Format') as HTMLSelectElement;
    expect(select.value).toBe('URL');
    expect(screen.getByText('▼ Apply URL Encoding')).toBeInTheDocument();
  });

  it('should encode URL correctly', () => {
    render(<EncodeDecodeForm />);
    const encodingTextarea = screen.getByLabelText(
      "Please input text you'd like to encode.",
    );
    const decodingTextarea = screen.getByLabelText(
      "Please input text you'd like to decode.",
    );
    const encodeButton = screen.getByText('▼ Apply URL Encoding');

    fireEvent.change(encodingTextarea, {
      target: {value: 'https://example.com/?q=あ'},
    });
    fireEvent.click(encodeButton);

    expect(decodingTextarea).toHaveValue(
      'https%3A%2F%2Fexample.com%2F%3Fq%3D%E3%81%82',
    );
  });

  it('should decode URL correctly', () => {
    render(<EncodeDecodeForm />);
    const encodingTextarea = screen.getByLabelText(
      "Please input text you'd like to encode.",
    );
    const decodingTextarea = screen.getByLabelText(
      "Please input text you'd like to decode.",
    );
    const decodeButton = screen.getByText('▲ Apply URL Decoding');

    fireEvent.change(decodingTextarea, {
      target: {value: 'https%3A%2F%2Fexample.com%2F%3Fq%3D%E3%81%82'},
    });
    fireEvent.click(decodeButton);

    expect(encodingTextarea).toHaveValue('https://example.com/?q=あ');
  });

  it('should change mode to Base64 and clear textareas', () => {
    render(<EncodeDecodeForm />);
    const select = screen.getByLabelText('Format');
    const encodingTextarea = screen.getByLabelText(
      "Please input text you'd like to encode.",
    );

    fireEvent.change(encodingTextarea, {target: {value: 'test'}});
    expect(encodingTextarea).toHaveValue('test');

    fireEvent.change(select, {target: {value: 'Base64'}});

    // Changing mode should clear the text
    const encodingTextareaBase64 = screen.getByLabelText(
      "Please input text you'd like to encode. (UTF-8)",
    );
    expect(encodingTextareaBase64).toHaveValue('');
    expect(screen.getByText('▼ Apply Base64 Encoding')).toBeInTheDocument();
  });

  it('should encode Base64 correctly', () => {
    render(<EncodeDecodeForm />);
    const select = screen.getByLabelText('Format');
    fireEvent.change(select, {target: {value: 'Base64'}});

    const encodingTextarea = screen.getByLabelText(
      "Please input text you'd like to encode. (UTF-8)",
    );
    const decodingTextarea = screen.getByLabelText(
      "Please input text you'd like to decode.",
    );
    const encodeButton = screen.getByText('▼ Apply Base64 Encoding');

    fireEvent.change(encodingTextarea, {
      target: {value: 'あいうえお UTF-8 123'},
    });
    fireEvent.click(encodeButton);

    expect(decodingTextarea).toHaveValue(
      '44GC44GE44GG44GI44GKIFVURi04IDEyMw==',
    );
  });

  it('should decode Base64 correctly', () => {
    render(<EncodeDecodeForm />);
    const select = screen.getByLabelText('Format');
    fireEvent.change(select, {target: {value: 'Base64'}});

    const encodingTextarea = screen.getByLabelText(
      "Please input text you'd like to encode. (UTF-8)",
    );
    const decodingTextarea = screen.getByLabelText(
      "Please input text you'd like to decode.",
    );
    const decodeButton = screen.getByText('▲ Apply Base64 Decoding');

    fireEvent.change(decodingTextarea, {
      target: {value: '44GC44GE44GG44GI44GKIFVURi04IDEyMw=='},
    });
    fireEvent.click(decodeButton);

    expect(encodingTextarea).toHaveValue('あいうえお UTF-8 123');
  });
});
