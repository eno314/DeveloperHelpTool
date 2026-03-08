'use client';

import React, {useState} from 'react';

const textAreaStyle = {
  height: 100,
};

const Base64EncodeForm = (): React.JSX.Element => {
  const [decodedText, setDecodedText] = useState('');
  const [encodedText, setEncodedText] = useState('');

  return (
    <div className={'container'}>
      <div className={'row form-floating'}>
        <textarea
          id="encodingTextarea"
          className={'form-control textarea'}
          style={textAreaStyle}
          value={decodedText}
          placeholder="UTF-8"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setDecodedText(e.target.value);
          }}
        />
        <label htmlFor={'encodingTextarea'}>
          Please input text you&apos;d like to encode. (UTF-8)
        </label>
      </div>
      <div className={'row'}>
        <div className={'col text-center'}>
          <button
            type={'button'}
            className={'btn btn-primary'}
            onClick={() => {
              setEncodedText(toEncodedText(decodedText));
            }}
          >
            ▼ Apply Base64 Encoding
          </button>
        </div>
        <div className={'col text-center'}>
          <button
            type={'button'}
            className={'btn btn-primary'}
            onClick={() => {
              setDecodedText(toDecodedText(encodedText));
            }}
          >
            ▲ Apply Base64 Decoding
          </button>
        </div>
      </div>
      <div className={'row form-floating'}>
        <textarea
          id="decodingTextarea"
          className={'form-control textarea'}
          style={textAreaStyle}
          value={encodedText}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setEncodedText(e.target.value);
          }}
        />
        <label htmlFor={'decodingTextarea'}>
          Please input text you&apos;d like to decode.
        </label>
      </div>
    </div>
  );
};

const toEncodedText = (text: string): string => {
  try {
    const bytes = new TextEncoder().encode(text);
    const binString = Array.from(bytes, byte =>
      String.fromCodePoint(byte),
    ).join('');
    return btoa(binString);
  } catch (err) {
    const errMessage: string = (err as Error).toString();
    return `can not encode. ${errMessage}.`;
  }
};

const toDecodedText = (text: string): string => {
  try {
    const binString = atob(text);
    const bytes = Uint8Array.from(binString, m => m.codePointAt(0)!);
    return new TextDecoder().decode(bytes);
  } catch (err) {
    const errMessage: string = (err as Error).toString();
    return `can not decode. ${errMessage}.`;
  }
};

export default Base64EncodeForm;
