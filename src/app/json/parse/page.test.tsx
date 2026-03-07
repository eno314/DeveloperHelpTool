import React from 'react'
import { render, screen } from '@testing-library/react'
import JSONParse from './page'
import '@testing-library/jest-dom'

describe('JSON Parse Page', () => {
  it('renders DeveloperHelpToolFrame and subTitle', () => {
    render(<JSONParse />)
    expect(screen.getByText('JSON Parse Tool')).toBeInTheDocument()
    expect(screen.getByText('Developer Help Tool')).toBeInTheDocument()
  })
})
