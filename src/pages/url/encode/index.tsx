import DeveloperHelpToolFrame from '@/components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame'
import UrlEncodeForm from '@/components/molecules/UrlEncodForm/UrlEncodeForm'
import React from 'react'

const UrlEncode = (): JSX.Element => {
  return <DeveloperHelpToolFrame
        subTitle={'Url Encode And Decode Tool'}
        content={<UrlEncodeForm />}
    />
}

export default UrlEncode
