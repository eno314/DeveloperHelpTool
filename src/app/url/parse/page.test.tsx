import React from 'react'
import { render, screen } from '@testing-library/react'
import UrlParse from './page'
import '@testing-library/jest-dom'

describe('Url Parse Page', () => {
  it('renders DeveloperHelpToolFrame and subTitle', () => {
    render(<UrlParse />)
    expect(screen.getByText('Url Parse Tool')).toBeInTheDocument()
    expect(screen.getByText('Developer Help Tool')).toBeInTheDocument()
  })
})
