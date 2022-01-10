import DeveloperHelpToolFrame from '@/components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame'
import UrlEncodeForm from '@/components/molecules/UrlEncodForm/UrlEncodeForm'
import React from 'react'

export default function UrlEncode (): JSX.Element {
  return <DeveloperHelpToolFrame
        subTitle={'Url Encode And Decode Tool'}
        content={<UrlEncodeForm />}
    />
}
