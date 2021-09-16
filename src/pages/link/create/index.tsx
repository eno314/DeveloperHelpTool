import DeveloperHelpToolFrame from '@/components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame'
import LinkCreateForm from '@/components/molecules/LinkCreateForm/LinkCreateForm'
import React from 'react'

export default function UrlEncode() {
    return <DeveloperHelpToolFrame
        subTitle={"Link Create Tool"}
        content={<LinkCreateForm />}
    />
}
