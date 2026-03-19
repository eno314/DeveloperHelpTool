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
    expect(screen.getByText('Encoding ▶')).toBeInTheDocument();
    expect(screen.getByText('◀ Decoding')).toBeInTheDocument();
  });

  it('should encode URL correctly', () => {
    render(<EncodeDecodeForm />);
    const encodingTextarea = screen.getByLabelText(
      "Please input text you'd like to encode.",
    );
    const decodingTextarea = screen.getByLabelText(
      "Please input text you'd like to decode.",
    );
    const encodeButton = screen.getByText('Encoding ▶');

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
    const decodeButton = screen.getByText('◀ Decoding');

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
    expect(screen.getByText('Encoding ▶')).toBeInTheDocument();
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
    const encodeButton = screen.getByText('Encoding ▶');

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
    const decodeButton = screen.getByText('◀ Decoding');

    fireEvent.change(decodingTextarea, {
      target: {value: '44GC44GE44GG44GI44GKIFVURi04IDEyMw=='},
    });
    fireEvent.click(decodeButton);

    expect(encodingTextarea).toHaveValue('あいうえお UTF-8 123');
  });

  it('should display error when decoding invalid URL', () => {
    render(<EncodeDecodeForm />);
    const encodingTextarea = screen.getByLabelText(
      "Please input text you'd like to encode.",
    );
    const decodingTextarea = screen.getByLabelText(
      "Please input text you'd like to decode.",
    );
    const decodeButton = screen.getByText('◀ Decoding');

    fireEvent.change(decodingTextarea, {
      target: {value: '%E3%81%82%'},
    });
    fireEvent.click(decodeButton);

    expect(encodingTextarea.textContent).toContain(
      'can not decode. URIError: URI malformed.',
    );
  });

  it('should display error when decoding invalid Base64 string', () => {
    render(<EncodeDecodeForm />);
    const select = screen.getByLabelText('Format');
    fireEvent.change(select, {target: {value: 'Base64'}});

    const encodingTextarea = screen.getByLabelText(
      "Please input text you'd like to encode. (UTF-8)",
    );
    const decodingTextarea = screen.getByLabelText(
      "Please input text you'd like to decode.",
    );
    const decodeButton = screen.getByText('◀ Decoding');

    // "InvalidCharacterError" string
    fireEvent.change(decodingTextarea, {
      target: {value: 'Invalid%%!!'},
    });
    fireEvent.click(decodeButton);

    expect(encodingTextarea.textContent).toContain(
      'can not decode. InvalidCharacterError',
    );
  });

  it('should change mode to JSON and clear textareas', () => {
    render(<EncodeDecodeForm />);
    const select = screen.getByLabelText('Format');
    const encodingTextarea = screen.getByLabelText(
      "Please input text you'd like to encode.",
    );

    fireEvent.change(encodingTextarea, {target: {value: 'test'}});
    expect(encodingTextarea).toHaveValue('test');

    fireEvent.change(select, {target: {value: 'JSON'}});

    expect(encodingTextarea).toHaveValue('');
    expect(screen.getByText('Encoding ▶')).toBeInTheDocument();
  });

  it('should encode JSON correctly', () => {
    render(<EncodeDecodeForm />);
    const select = screen.getByLabelText('Format');
    fireEvent.change(select, {target: {value: 'JSON'}});

    const encodingTextarea = screen.getByLabelText(
      "Please input text you'd like to encode.",
    );
    const decodingTextarea = screen.getByLabelText(
      "Please input text you'd like to decode.",
    );
    const encodeButton = screen.getByText('Encoding ▶');

    const inputJSON = `{
  "key": "value",
  "num": 123
}`;
    fireEvent.change(encodingTextarea, {
      target: {value: inputJSON},
    });
    fireEvent.click(encodeButton);

    expect(decodingTextarea).toHaveValue('{"key":"value","num":123}');
  });

  it('should handle encode error gracefully in Base64 mode', () => {
    // Mock btoa to throw an error
    const originalBtoa = global.btoa;
    global.btoa = jest.fn(() => {
      throw new Error('Mock btoa error');
    });

    render(<EncodeDecodeForm />);
    const select = screen.getByLabelText('Format');
    fireEvent.change(select, {target: {value: 'Base64'}});

    const encodingTextarea = screen.getByLabelText(
      "Please input text you'd like to encode. (UTF-8)",
    );
    const decodingTextarea = screen.getByLabelText(
      "Please input text you'd like to decode.",
    );
    const encodeButton = screen.getByText('Encoding ▶');

    fireEvent.change(encodingTextarea, {
      target: {value: 'test string'},
    });
    fireEvent.click(encodeButton);

    expect(decodingTextarea).toHaveValue(
      'can not encode. Error: Mock btoa error.',
    );

    // Restore original btoa
    global.btoa = originalBtoa;
  });

  it('should decode JSON correctly', () => {
    render(<EncodeDecodeForm />);
    const select = screen.getByLabelText('Format');
    fireEvent.change(select, {target: {value: 'JSON'}});

    const encodingTextarea = screen.getByLabelText(
      "Please input text you'd like to encode.",
    );
    const decodingTextarea = screen.getByLabelText(
      "Please input text you'd like to decode.",
    );
    const decodeButton = screen.getByText('◀ Decoding');

    fireEvent.change(decodingTextarea, {
      target: {value: '{"key":"value","num":123}'},
    });
    fireEvent.click(decodeButton);

    const expectedJSON = `{
  "key": "value",
  "num": 123
}`;
    expect(encodingTextarea).toHaveValue(expectedJSON);
  });

  it('should display error when encoding invalid JSON', () => {
    render(<EncodeDecodeForm />);
    const select = screen.getByLabelText('Format');
    fireEvent.change(select, {target: {value: 'JSON'}});

    const encodingTextarea = screen.getByLabelText(
      "Please input text you'd like to encode.",
    );
    const decodingTextarea = screen.getByLabelText(
      "Please input text you'd like to decode.",
    );
    const encodeButton = screen.getByText('Encoding ▶');

    fireEvent.change(encodingTextarea, {
      target: {value: '{invalid_json}'},
    });
    fireEvent.click(encodeButton);

    expect(decodingTextarea.textContent).toContain(
      'can not encode. SyntaxError',
    );
  });

  it('should display error when decoding invalid JSON', () => {
    render(<EncodeDecodeForm />);
    const select = screen.getByLabelText('Format');
    fireEvent.change(select, {target: {value: 'JSON'}});

    const encodingTextarea = screen.getByLabelText(
      "Please input text you'd like to encode.",
    );
    const decodingTextarea = screen.getByLabelText(
      "Please input text you'd like to decode.",
    );
    const decodeButton = screen.getByText('◀ Decoding');

    fireEvent.change(decodingTextarea, {
      target: {value: '{invalid_json}'},
    });
    fireEvent.click(decodeButton);

    expect(encodingTextarea.textContent).toContain(
      'can not decode. SyntaxError',
    );
  });

  it('should read file contents when a file is uploaded to encode (left side)', async () => {
    render(<EncodeDecodeForm />);
    const select = screen.getByLabelText('Format');
    fireEvent.change(select, {target: {value: 'JSON'}});

    const fileInput = screen.getByLabelText('Upload File to Encode');
    const encodingTextarea = screen.getByLabelText(
      "Please input text you'd like to encode.",
    );

    const file = new File(['{"fileKey":"fileValue"}'], 'test.json', {
      type: 'application/json',
    });

    fireEvent.change(fileInput, {target: {files: [file]}});

    // Wait for the FileReader to complete
    await screen.findByDisplayValue('{"fileKey":"fileValue"}');
    expect(encodingTextarea).toHaveValue('{"fileKey":"fileValue"}');
  });

  it('should read file contents when a file is uploaded to decode (right side)', async () => {
    render(<EncodeDecodeForm />);
    const select = screen.getByLabelText('Format');
    fireEvent.change(select, {target: {value: 'JSON'}});

    const fileInput = screen.getByLabelText('Upload File to Decode');
    const decodingTextarea = screen.getByLabelText(
      "Please input text you'd like to decode.",
    );

    const file = new File(['{"decodeKey":123}'], 'test2.json', {
      type: 'application/json',
    });

    fireEvent.change(fileInput, {target: {files: [file]}});

    // Wait for the FileReader to complete
    await screen.findByDisplayValue('{"decodeKey":123}');
    expect(decodingTextarea).toHaveValue('{"decodeKey":123}');
  });
});
