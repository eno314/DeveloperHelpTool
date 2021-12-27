/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react';
import UrlEncodeForm from './UrlEncodeForm';

describe('render', () => {

    test('UrlEncodeForm has 2 textarea', () => {
        render(<UrlEncodeForm />)

        const textBoxes = screen.getAllByRole('textbox')
        expect(textBoxes).toHaveLength(2)
    });

    test('UrlEncodeForm has 2 button', () => {
        render(<UrlEncodeForm />)

        const buttons = screen.getAllByRole('button')
        expect(buttons).toHaveLength(2)
        expect(buttons[0]).toHaveTextContent('▼ Apply URL Encoding')
        expect(buttons[1]).toHaveTextContent('▲ Apply URL Decoding')
    });
})

describe('onClickUrlEncode.', () => {

    test('decodedText should encode and encodedTextArea apply encodedText.', () => {
        render(<UrlEncodeForm />)

        const textBoxes = screen.getAllByRole('textbox')
        const buttons = screen.getAllByRole('button')

        fireEvent.change(textBoxes[0], { target: { value: 'あいうえお' } })
        fireEvent.click(buttons[0])

        expect(textBoxes[1]).toHaveValue('%E3%81%82%E3%81%84%E3%81%86%E3%81%88%E3%81%8A')
    });
})

describe('onClickUrlDecode.', () => {

    test('encodedText should decode and decodedTextArea apply decodedText.', () => {
        render(<UrlEncodeForm />)

        const textBoxes = screen.getAllByRole('textbox')
        const buttons = screen.getAllByRole('button')

        fireEvent.change(textBoxes[1], { target: { value: '%E3%81%82%E3%81%84%E3%81%86%E3%81%88%E3%81%8A' } })
        fireEvent.click(buttons[1])

        expect(textBoxes[0]).toHaveValue('あいうえお')
    });

    test('when encodedText is invalid, decodedTextArea apply can not ', () => {
        render(<UrlEncodeForm />)

        const textBoxes = screen.getAllByRole('textbox')
        const buttons = screen.getAllByRole('button')

        fireEvent.change(textBoxes[1], { target: { value: '%E3%81%82%E3%81%84%E3%81%86%E3%81%88%E3%81' } })
        fireEvent.click(buttons[1])

        expect(textBoxes[0]).toHaveValue('can not decode. URIError: URI malformed.')
    });
})
