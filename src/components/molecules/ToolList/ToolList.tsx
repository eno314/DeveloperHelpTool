import Link from 'next/link'
import React from 'react'

interface Props {
  toolList: Tool[]
}

interface Tool {
  linkPath: string
  title: string
  description: string
}

const ToolList = ({ toolList }: Props): JSX.Element => {
  return (
    <div className={'list-group'}>
      {toolList.map((link, index) => toolLink(link, index))}
    </div>
  )
}

const toolLink = (tool: Tool, index: number): React.ReactNode => {
  return (
    <Link href={tool.linkPath} key={index}>
      <a className={'list-group-item list-group-item-action'}>
          <div className={'d-flex justify-content-between'}>
              <h5 className="mb-1">{tool.title}</h5>
          </div>
          <p className="mb-1">{tool.description}</p>
      </a>
    </Link>
  )
}

export default ToolList
