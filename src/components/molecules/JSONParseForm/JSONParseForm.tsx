import React, { useState } from 'react'

const JSONEncodeForm = (): JSX.Element => {
  const textAreaStyle = {
    height: 500
  }

  const [jsonText, setJsonText] = useState('')
  const [resultText, setResultText] = useState('')

  return (
    <div className={'container'} >
      <div className={'row align-items-center'}>
        <div className={'col-5'}>
          <label htmlFor={'jsonTextarea'}>Please input JSON text you'd like to parse.</label>
          <textarea
            id="jsonTextarea"
            className={'form-control textarea'}
            style={textAreaStyle}
            value={jsonText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJsonText(e.target.value)}
          />
        </div>
        <div className={'col-2 text-center'}>
          <button
            type={'button'}
            className={'btn btn-primary'}
            onClick={() => setResultText(toParsedText(jsonText))}
          >Parse JSON ▶︎</button>
        </div>
        <div className={'col-5'}>
          <label htmlFor={'resultTextarea'}>Parsed Result.</label>
          <textarea
            id="resultTextarea"
            className={'form-control textarea'}
            style={textAreaStyle}
            value={resultText}
            readOnly={true}
          />
        </div>
      </div>
    </div>
  )
}

const toParsedText = (text: string): string => {
  if (text.length === 0) {
    return ''
  }
  return createObjectText(JSON.parse(text), 0)
}

const isObject = (target: any): boolean => {
  return target !== null && typeof target === 'object'
}

const createObjectText = (object: Object, nestSize: number): string => {
  const outerIndent = '  '.repeat(nestSize)
  const innerIndent = '  '.repeat(nestSize + 1)
  let result = 'object('

  Object.keys(object).forEach((key) => {
    const value = object[key]
    if (isObject(value)) {
      result += `\n${innerIndent}${key} : ${createObjectText(value, nestSize + 1)}`
    } else {
      result += `\n${innerIndent}${key} : ${String(value)}`
    }
  })
  result += `\n${outerIndent})`
  return result
}

export default JSONEncodeForm
