'use client';

import React, {useState} from 'react';

const JSONEncodeForm = (): React.JSX.Element => {
  const textAreaStyle = {
    height: 500,
  };

  const [jsonText, setJsonText] = useState('');
  const [resultText, setResultText] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setJsonText(content);
      }
    };
    reader.readAsText(file);
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  return (
    <div className={'container'}>
      <div className={'row align-items-center'}>
        <div className={'col-5'}>
          <div className="d-flex justify-content-between align-items-end mb-2">
            <label htmlFor={'jsonTextarea'} className="mb-0">
              Please input JSON text you&apos;d like to parse.
            </label>
            <input
              type="file"
              accept=".json"
              className="form-control form-control-sm w-auto"
              onChange={handleFileUpload}
              aria-label="Upload JSON file"
            />
          </div>
          <textarea
            id="jsonTextarea"
            className={'form-control textarea'}
            style={textAreaStyle}
            value={jsonText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setJsonText(e.target.value);
            }}
          />
        </div>
        <div className={'col-2 text-center'}>
          <button
            type={'button'}
            className={'btn btn-primary'}
            onClick={() => {
              setResultText(toParsedText(jsonText));
            }}
          >
            Parse JSON ▶︎
          </button>
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
  );
};

const toParsedText = (text: string): string => {
  if (text.length === 0) {
    return '';
  }
  return createObjectText(JSON.parse(text), 0);
};

const isObject = (target: unknown): target is Record<string, unknown> => {
  return target !== null && typeof target === 'object';
};

const createObjectText = (
  object: Record<string, unknown>,
  nestSize: number,
): string => {
  const outerIndent = '  '.repeat(nestSize);
  const innerIndent = '  '.repeat(nestSize + 1);
  let result = 'object(';

  Object.keys(object).forEach(key => {
    const value = object[key];
    if (isObject(value)) {
      result += `\n${innerIndent}${key} : ${createObjectText(value, nestSize + 1)}`;
    } else {
      result += `\n${innerIndent}${key} : ${String(value)}`;
    }
  });
  result += `\n${outerIndent})`;
  return result;
};

export default JSONEncodeForm;
