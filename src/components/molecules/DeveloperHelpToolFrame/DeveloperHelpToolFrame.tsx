import Head from 'next/head'
import React from 'react'

interface Props {
  subTitle: string
  content: React.ReactNode
}

const DeveloperHelpToolFrame = (props: Props): JSX.Element => {
  return (
    <div>
      <Head>
        <title>Developer Help Tool - {props.subTitle}</title>
      </Head>

      <main>
        <h1 className={'col text-center'}>Developer Help Tool</h1>
        <h2 className={'col text-center'}>{props.subTitle}</h2>
        {props.content}
      </main>
    </div>
  )
}

export default DeveloperHelpToolFrame
