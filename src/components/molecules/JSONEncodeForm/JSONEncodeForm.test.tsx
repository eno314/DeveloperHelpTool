/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react'
import JSONEncodeForm from './JSONEncodeForm'

describe('render', () => {
  test('JSONEncodeForm has 2 textbox', () => {
    render(<JSONEncodeForm />)

    const textBoxes = screen.getAllByRole('textbox')
    expect(textBoxes).toHaveLength(2)
    expect(textBoxes[0]).toHaveAttribute('id', 'jsonTextarea')
    expect(textBoxes[1]).toHaveAttribute('id', 'resultTextarea')
  })

  test('JSONEncodeForm has 1 button', () => {
    render(<JSONEncodeForm />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(1)
    expect(buttons[0]).toHaveTextContent('Parse JSON ▶')
  })
})

describe('onClickParseButton', () => {
  test('Text of jsonTextarea should parse', () => {
    render(<JSONEncodeForm />)

    const textBoxes = screen.getAllByRole('textbox')
    const buttons = screen.getAllByRole('button')

    const json = '{"num": 123,"str":"abc","bool":false,"obj":{"array":[1,"a",true]}}'
    fireEvent.change(textBoxes[0], { target: { value: json } })
    fireEvent.click(buttons[0])

    const expectedValue = 'object(\n  num : 123\n  str : abc\n  bool : false\n' +
            '  obj : object(\n    array : object(\n      0 : 1\n      1 : a\n      2 : true\n    )\n  )\n)'
    expect(textBoxes[1]).toHaveValue(expectedValue)
  })

  test('when text of jsonTextarea is empty then resultTextarea is empty', () => {
    render(<JSONEncodeForm />)

    const textBoxes = screen.getAllByRole('textbox')
    const buttons = screen.getAllByRole('button')

    fireEvent.click(buttons[0])

    expect(textBoxes[1]).toHaveValue('')
  })
})
