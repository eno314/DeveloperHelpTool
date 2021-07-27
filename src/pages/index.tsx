import UrlEncodeForm from '@/components/molecules/UrlEncodForm/UrlEncodeForm'
import Head from 'next/head'
import React from 'react'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Developer Help Tool</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={"col text-center"}>Developer Help Tool</h1>
        <h2 className={"col text-center"}>Url Encode And Decode Tool</h2>
        <UrlEncodeForm />
      </main>
    </div>
  )
}
