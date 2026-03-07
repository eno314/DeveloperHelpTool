'use client'

import React, { useState } from 'react'

const textAreaStyle = {
  height: 100
}

const UrlEncodeForm = (): React.JSX.Element => {
  const [decodedText, setDecodedText] = useState('')
  const [encodedText, setEncodedText] = useState('')

  return (
    <div className={'container'}>
      <div className={'row form-floating'}>
          <textarea
            id="encodingTextarea"
            className={'form-control textarea'}
            style={textAreaStyle}
            value={decodedText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => { setDecodedText(e.target.value) }}
          />
          <label htmlFor={'encodingTextarea'}>Please input text you'd like to encode.</label>
      </div>
      <div className={'row'}>
          <div className={'col text-center'}>
              <button
                type={'button'}
                className={'btn btn-primary'}
                onClick={() => { setEncodedText(toEncodedText(decodedText)) }}
              >▼ Apply URL Encoding</button>
          </div>
          <div className={'col text-center'}>
              <button
                type={'button'}
                className={'btn btn-primary'}
                onClick={() => { setDecodedText(toDecodedText(encodedText)) }}
              >▲ Apply URL Decoding</button>
          </div>
      </div>
      <div className={'row form-floating'}>
          <textarea
              id="decodingTextarea"
              className={'form-control textarea'}
              style={textAreaStyle}
              value={encodedText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => { setEncodedText(e.target.value) }}
          />
          <label htmlFor={'decodingTextarea'}>Please input text you'd like to decode.</label>
      </div>
    </div>
  )
}

const toEncodedText = (text: string): string => {
  return encodeURIComponent(text)
}

const toDecodedText = (text: string): string => {
  try {
    return decodeURIComponent(text)
  } catch (err) {
    const errMessage: string = err.toString()
    return `can not decode. ${errMessage}.`
  }
}

export default UrlEncodeForm
