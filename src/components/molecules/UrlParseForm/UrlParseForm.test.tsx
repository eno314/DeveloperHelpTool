/**
 * @jest-environment jsdom
 */

import UrlParseForm from './UrlParseForm'
import { fireEvent, render, screen } from '@testing-library/react'

describe('render', () => {
  test('UrlParseForm has 2 text boxes', () => {
    render(<UrlParseForm />)

    const textBoxes = screen.getAllByRole('textbox')
    expect(textBoxes).toHaveLength(2)
    expect(textBoxes[0]).toHaveAttribute('aria-describedby', 'parsedUrl')
    expect(textBoxes[1]).toHaveAttribute('aria-describedby', 'baseUrl')
  })

  test('UrlParseForm has 3 buttons', () => {
    render(<UrlParseForm />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
    expect(buttons[0]).toHaveTextContent('▼ Parse URL')
    expect(buttons[1]).toHaveTextContent('▲ Build URL')
    expect(buttons[2]).toHaveTextContent('add param')
  })
})

describe('onClickAddParam', () => {
  test('when click add param button once, add a form to input url param', () => {
    render(<UrlParseForm />)

    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[2])

    const newButtons = screen.getAllByRole('button')
    expect(newButtons).toHaveLength(4)
    expect(newButtons[2]).toHaveTextContent('delete')

    const newTextBoxes = screen.getAllByRole('textbox')
    expect(newTextBoxes).toHaveLength(4)
    expect(newTextBoxes[2]).toHaveAttribute('data-index', '0')
    expect(newTextBoxes[2]).toHaveAttribute('data-type', 'key')
    expect(newTextBoxes[3]).toHaveAttribute('data-index', '0')
    expect(newTextBoxes[3]).toHaveAttribute('data-type', 'value')
  })

  test('when click add param button twice, add two forms to input url param', () => {
    render(<UrlParseForm />)

    fireEvent.click(screen.getAllByRole('button')[2])
    fireEvent.click(screen.getAllByRole('button')[3])

    const newButtons = screen.getAllByRole('button')
    expect(newButtons).toHaveLength(5)
    expect(newButtons[3]).toHaveTextContent('delete')

    const newTextBoxes = screen.getAllByRole('textbox')
    expect(newTextBoxes).toHaveLength(6)
    expect(newTextBoxes[4]).toHaveAttribute('data-index', '1')
    expect(newTextBoxes[4]).toHaveAttribute('data-type', 'key')
    expect(newTextBoxes[5]).toHaveAttribute('data-index', '1')
    expect(newTextBoxes[5]).toHaveAttribute('data-type', 'value')
  })
})

describe('onClickDeleteParam', () => {
  test('delete form to input url param', () => {
    render(<UrlParseForm />)

    // add two form to input url param
    fireEvent.click(screen.getAllByRole('button')[2])
    fireEvent.click(screen.getAllByRole('button')[3])
    // click delete form button
    fireEvent.click(screen.getAllByRole('button')[3])

    expect(screen.getAllByRole('button')).toHaveLength(4)
    expect(screen.getAllByRole('textbox')).toHaveLength(4)
  })
})

describe('onClickUrlParse', () => {
  test('when parsed url does not have any param, add parsed url to base url', () => {
    render(<UrlParseForm />)

    const parsedUrl = 'https://developer-help-tool.app/hoge/fuga'

    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: parsedUrl } })
    fireEvent.click(screen.getAllByRole('button')[0])

    const textBoxes = screen.getAllByRole('textbox')
    expect(textBoxes).toHaveLength(2)
    expect(textBoxes[1]).toHaveValue(parsedUrl)
  })

  test('when parsed url has params, add base url and form to input url param', () => {
    render(<UrlParseForm />)

    const parsedUrl = 'https://developer-help-tool.app/hoge/fuga?foo=bar&baz=%E3%81%82%E3%81%84%E3%81%86%E3%81%88%E3%81%8A'

    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: parsedUrl } })
    fireEvent.click(screen.getAllByRole('button')[0])

    const textBoxes = screen.getAllByRole('textbox')
    expect(textBoxes).toHaveLength(6)
    expect(textBoxes[1]).toHaveValue('https://developer-help-tool.app/hoge/fuga')
    expect(textBoxes[2]).toHaveValue('foo')
    expect(textBoxes[3]).toHaveValue('bar')
    expect(textBoxes[4]).toHaveValue('baz')
    expect(textBoxes[5]).toHaveValue('あいうえお')
  })
})

describe('onClickUrlBuild', () => {
  const basedUrl = 'https://developer-help-tool.app/hoge/fuga'

  test('when does not exist any params, add based url to parsed url', () => {
    render(<UrlParseForm />)

    fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: basedUrl } })
    fireEvent.click(screen.getAllByRole('button')[1])

    expect(screen.getAllByRole('textbox')[0]).toHaveValue(basedUrl)
  })

  test('when exists params, add based url with params', () => {
    render(<UrlParseForm />)

    // add two forms to input param
    fireEvent.click(screen.getAllByRole('button')[2])
    fireEvent.click(screen.getAllByRole('button')[3])

    const textBoxes = screen.getAllByRole('textbox')
    fireEvent.change(textBoxes[1], { target: { value: basedUrl } })
    fireEvent.change(textBoxes[2], { target: { value: 'foo' } })
    fireEvent.change(textBoxes[3], { target: { value: 'bar' } })
    fireEvent.change(textBoxes[4], { target: { value: 'baz' } })
    fireEvent.change(textBoxes[5], { target: { value: 'あいうえお' } })

    fireEvent.click(screen.getAllByRole('button')[1])

    const expected = 'https://developer-help-tool.app/hoge/fuga?foo=bar&baz=%E3%81%82%E3%81%84%E3%81%86%E3%81%88%E3%81%8A'
    expect(screen.getAllByRole('textbox')[0]).toHaveValue(expected)
  })

  test('when exists params, but params key is empty, add based url without params', () => {
    render(<UrlParseForm />)

    fireEvent.click(screen.getAllByRole('button')[2])

    const textBoxes = screen.getAllByRole('textbox')
    fireEvent.change(textBoxes[1], { target: { value: basedUrl } })
    fireEvent.change(textBoxes[2], { target: { value: '' } })
    fireEvent.change(textBoxes[3], { target: { value: 'bar' } })

    fireEvent.click(screen.getAllByRole('button')[1])

    expect(screen.getAllByRole('textbox')[0]).toHaveValue(basedUrl)
  })

  test('when exists params, but params value is empty, add based url without params', () => {
    render(<UrlParseForm />)

    fireEvent.click(screen.getAllByRole('button')[2])

    const textBoxes = screen.getAllByRole('textbox')
    fireEvent.change(textBoxes[1], { target: { value: basedUrl } })
    fireEvent.change(textBoxes[2], { target: { value: 'foo' } })
    fireEvent.change(textBoxes[3], { target: { value: '' } })

    fireEvent.click(screen.getAllByRole('button')[1])

    expect(screen.getAllByRole('textbox')[0]).toHaveValue(basedUrl)
  })
})
