/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import ToolList from './ToolList'

const toolList = [
  {
    linkPath: '/link/path/1',
    title: 'title1',
    description: 'description1'
  },
  {
    linkPath: '/link/path/2',
    title: 'title2',
    description: 'description2'
  }
]

describe('ToolList', () => {
  it('ToolList has linkPath in href attributes', () => {
    render(<ToolList toolList={toolList} />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', toolList[0].linkPath)
    expect(links[1]).toHaveAttribute('href', toolList[1].linkPath)
  })

  it('ToolList has title in heading text content', () => {
    render(<ToolList toolList={toolList} />)
    const headings = screen.getAllByRole('heading')
    expect(headings[0]).toHaveTextContent(toolList[0].title)
    expect(headings[1]).toHaveTextContent(toolList[1].title)
  })

  it('ToolList has description text', () => {
    render(<ToolList toolList={toolList} />)
    expect(screen.getByText(toolList[0].description)).toBeInTheDocument()
    expect(screen.getByText(toolList[1].description)).toBeInTheDocument()
  })
})
