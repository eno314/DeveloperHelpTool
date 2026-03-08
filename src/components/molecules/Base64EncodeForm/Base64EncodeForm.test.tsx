/**
 * @jest-environment jsdom
 */

import {fireEvent, render, screen} from '@testing-library/react';
import Base64EncodeForm from './Base64EncodeForm';
import {TextEncoder, TextDecoder} from 'util';

global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

describe('render', () => {
  test('Base64EncodeForm has 2 textarea', () => {
    render(<Base64EncodeForm />);

    const textBoxes = screen.getAllByRole('textbox');
    expect(textBoxes).toHaveLength(2);
  });

  test('Base64EncodeForm has 2 button', () => {
    render(<Base64EncodeForm />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('▼ Apply Base64 Encoding');
    expect(buttons[1]).toHaveTextContent('▲ Apply Base64 Decoding');
  });
});

describe('onClickBase64Encode.', () => {
  test('decodedText should encode and encodedTextArea apply encodedText.', () => {
    render(<Base64EncodeForm />);

    const textBoxes = screen.getAllByRole('textbox');
    const buttons = screen.getAllByRole('button');

    fireEvent.change(textBoxes[0], {target: {value: 'あいうえお'}});
    fireEvent.click(buttons[0]);

    expect(textBoxes[1]).toHaveValue('44GC44GE44GG44GI44GK');
  });
});

describe('onClickBase64Decode.', () => {
  test('encodedText should decode and decodedTextArea apply decodedText.', () => {
    render(<Base64EncodeForm />);

    const textBoxes = screen.getAllByRole('textbox');
    const buttons = screen.getAllByRole('button');

    fireEvent.change(textBoxes[1], {
      target: {value: '44GC44GE44GG44GI44GK'},
    });
    fireEvent.click(buttons[1]);

    expect(textBoxes[0]).toHaveValue('あいうえお');
  });

  test('when encodedText is invalid, decodedTextArea apply can not ', () => {
    render(<Base64EncodeForm />);

    const textBoxes = screen.getAllByRole('textbox');
    const buttons = screen.getAllByRole('button');

    fireEvent.change(textBoxes[1], {
      target: {value: 'あいうえお'},
    });
    fireEvent.click(buttons[1]);

    expect(textBoxes[0]).toHaveValue(
      'can not decode. InvalidCharacterError: The string to be decoded contains invalid characters..',
    );
  });
});
