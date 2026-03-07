import type { Metadata } from 'next'
import DeveloperHelpToolFrame from '@/components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame'
import UrlParseForm from '@/components/molecules/UrlParseForm/UrlParseForm'
import React from 'react'

export const metadata: Metadata = {
  title: 'Developer Help Tool - Url Parse Tool'
}

const UrlParse = (): React.JSX.Element => {
  return <DeveloperHelpToolFrame
        subTitle={'Url Parse Tool'}
        content={<UrlParseForm />}
    />
}

export default UrlParse
