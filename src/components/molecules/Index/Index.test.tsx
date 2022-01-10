/**
 * @jest-environment jsdom
 */

import Index from './Index'
import { render, screen } from '@testing-library/react'

describe('Index', () => {
  test('renders Index component', () => {
    render(<Index />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/string/replace')
    expect(links[1]).toHaveAttribute('href', '/url/encode')
    expect(links[2]).toHaveAttribute('href', '/url/parse')
  })
})
