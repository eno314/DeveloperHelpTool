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

const ToolList = ({ toolList }: Props): React.JSX.Element => {
  return (
    <div className={'list-group'}>
      {/* eslint-disable-next-line @typescript-eslint/promise-function-async */}
      {toolList.map((link, index) => toolLink(link, index))}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/promise-function-async
const toolLink = (tool: Tool, index: number): React.ReactNode => {
  return (
    <Link href={tool.linkPath} key={index} className={'list-group-item list-group-item-action'}>
        <div className={'d-flex justify-content-between'}>
            <h5 className="mb-1">{tool.title}</h5>
        </div>
        <p className="mb-1">{tool.description}</p>
    </Link>
  )
}

export default ToolList
