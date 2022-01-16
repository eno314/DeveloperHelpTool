import DeveloperHelpToolFrame from '@/components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame'
import UrlParseForm from '@/components/molecules/UrlParseForm/UrlParseForm'
import React from 'react'

const UrlParse = (): JSX.Element => {
  return <DeveloperHelpToolFrame
        subTitle={'Url Parse Tool'}
        content={<UrlParseForm />}
    />
}

export default UrlParse
