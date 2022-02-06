import DeveloperHelpToolFrame from '@/components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame'
import JSONEncodeForm from '@/components/molecules/JSONEncodeForm/JSONEncodeForm'
import React from 'react'

const JSONEncode = (): JSX.Element => {
  return (
    <DeveloperHelpToolFrame
      subTitle={'JSON Encode And Decode Tool'}
      content={<JSONEncodeForm />}
    />
  )
}

export default JSONEncode
