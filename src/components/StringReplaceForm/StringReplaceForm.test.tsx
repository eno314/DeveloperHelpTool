/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react';
import StringReplaceForm from './StringReplaceForm';

describe('render', () => {

    test('StringReplaceForm has 4 textbox', () => {
        render(<StringReplaceForm />)

        const textBoxes = screen.getAllByRole('textbox')
        expect(textBoxes).toHaveLength(4)
        expect(textBoxes[0]).toHaveAttribute('id', 'replacedTextarea')
        expect(textBoxes[1]).toHaveAttribute('aria-describedby', 'targetSubstr')
        expect(textBoxes[2]).toHaveAttribute('aria-describedby', 'newSubstr')
        expect(textBoxes[3]).toHaveAttribute('id', 'newTextarea')
    })

    test('StringReplaceForm has 4 textbox', () => {
        render(<StringReplaceForm />)

        const buttons = screen.getAllByRole('button')
        expect(buttons).toHaveLength(1)
        expect(buttons[0]).toHaveTextContent('▼ Apply')
    })
})

describe('onClickReplace', () => {

    test('Text of replacedTextarea should replace', () => {
        render(<StringReplaceForm />)

        const textBoxes = screen.getAllByRole('textbox')
        const buttons = screen.getAllByRole('button')

        fireEvent.change(textBoxes[0], { target: { value: 'aaaa bbbb cccc' } })
        fireEvent.change(textBoxes[1], { target: { value: ' ' } })
        fireEvent.change(textBoxes[2], { target: { value: '\t' } })
        fireEvent.click(buttons[0])

        expect(textBoxes[3]).toHaveValue('aaaa\tbbbb\tcccc')
    })
})
