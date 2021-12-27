import DeveloperHelpToolFrame from "@/components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame";
import StringReplaceForm from "@/components/molecules/StringReplaceForm/StringReplaceForm";
import React from 'react'

export default function StringReplace() {
    return <DeveloperHelpToolFrame
        subTitle={"String Replace Tool"}
        content={<StringReplaceForm />}
    />
}
