import DeveloperHelpToolFrame from '@/components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame'
import UrlParseForm from '@/components/molecules/UrlParseForm/UrlParseForm'
import React from 'react'

export default function UrlParse() {
    return <DeveloperHelpToolFrame
        subTitle={"Url Parse Tool"}
        content={<UrlParseForm />}
    />
}
