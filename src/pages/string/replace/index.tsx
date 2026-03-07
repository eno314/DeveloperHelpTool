import DeveloperHelpToolFrame from '@/components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame'
import StringReplaceForm from '@/components/molecules/StringReplaceForm/StringReplaceForm'
import React from 'react'

const StringReplace = (): React.JSX.Element => {
  return <DeveloperHelpToolFrame
        subTitle={'String Replace Tool'}
        content={<StringReplaceForm />}
    />
}

export default StringReplace
