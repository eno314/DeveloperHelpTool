'use client';

import React, {useState} from 'react';

const textAreaStyle = {
  height: 100,
};

type EncodeDecodeMode = 'URL' | 'Base64';

const EncodeDecodeForm = (): React.JSX.Element => {
  const [mode, setMode] = useState<EncodeDecodeMode>('URL');
  const [decodedText, setDecodedText] = useState('');
  const [encodedText, setEncodedText] = useState('');

  const toEncodedText = (text: string): string => {
    if (mode === 'URL') {
      return encodeURIComponent(text);
    } else {
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
    }
  };

  const toDecodedText = (text: string): string => {
    if (mode === 'URL') {
      try {
        return decodeURIComponent(text);
      } catch (err) {
        const errMessage: string = (err as Error).toString();
        return `can not decode. ${errMessage}.`;
      }
    } else {
      try {
        const binString = atob(text);
        const bytes = Uint8Array.from(binString, m => m.codePointAt(0)!);
        return new TextDecoder().decode(bytes);
      } catch (err) {
        const errMessage: string = (err as Error).toString();
        return `can not decode. ${errMessage}.`;
      }
    }
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value as EncodeDecodeMode);
    setDecodedText('');
    setEncodedText('');
  };

  return (
    <div className={'container'}>
      <div className={'row mb-3'}>
        <div className={'col-md-4'}>
          <label htmlFor="modeSelect" className="form-label">
            Format
          </label>
          <select
            id="modeSelect"
            className="form-select"
            value={mode}
            onChange={handleModeChange}
          >
            <option value="URL">URL</option>
            <option value="Base64">Base64</option>
          </select>
        </div>
      </div>
      <div className={'row form-floating'}>
        <textarea
          id="encodingTextarea"
          className={'form-control textarea'}
          style={textAreaStyle}
          value={decodedText}
          placeholder={mode === 'Base64' ? 'UTF-8' : ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setDecodedText(e.target.value);
          }}
        />
        <label htmlFor={'encodingTextarea'}>
          {mode === 'Base64'
            ? "Please input text you'd like to encode. (UTF-8)"
            : "Please input text you'd like to encode."}
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
            ▼ Apply {mode} Encoding
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
            ▲ Apply {mode} Decoding
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

export default EncodeDecodeForm;
