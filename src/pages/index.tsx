import DeveloperHelpToolFrame from '@/components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame'
import Index from '@/components/molecules/Index/Index'
import React from 'react'

export default function Home() {
  return <DeveloperHelpToolFrame
    subTitle={"index page"}
    content={<Index />}
  />
}
