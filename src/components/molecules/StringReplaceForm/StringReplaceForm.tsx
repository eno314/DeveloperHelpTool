'use client';

import React, {type ChangeEvent, useState} from 'react';

const styles = {
  textArea: {
    height: 200,
    marginTop: 5,
    marginBottom: 5,
  },
  buttonsRow: {
    marginTop: 5,
    marginBottom: 5,
  },
};

const StringReplaceForm = (): React.JSX.Element => {
  const [replacedStr, setReplacedStr] = useState('');
  const [targetSubstr, setTargetSubstr] = useState('');
  const [newSubstr, setNewSubstr] = useState('');
  const [resultStr, setResultStr] = useState('');

  return (
    <div className={'container'}>
      <div className={'row form-floating'}>
        <textarea
          className={'form-control textarea'}
          id="replacedTextarea"
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setReplacedStr(e.target.value);
          }}
          style={styles.textArea}
          value={replacedStr}
        />
        <label htmlFor={'replacedTextarea'}>
          Please input text you&apos;d like to replace.
        </label>
      </div>
      <div className={'row'} style={styles.buttonsRow}>
        <div className={'input-group mb-3 col'}>
          <span className={'input-group-text'} id={'targetSubstr'}>
            target substr
          </span>
          <input
            aria-describedby={'targetSubstr'}
            className={'form-control'}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setTargetSubstr(e.target.value);
            }}
            placeholder={'Supports regular expression'}
            type={'text'}
            value={targetSubstr}
          />
        </div>
        <div className={'input-group mb-3 col'}>
          <span className={'input-group-text'} id={'newSubstr'}>
            new substr
          </span>
          <input
            aria-describedby={'newSubstr'}
            className={'form-control'}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNewSubstr(e.target.value);
            }}
            type={'text'}
            value={newSubstr}
          />
        </div>
      </div>
      <div className={'row'} style={styles.buttonsRow}>
        <div className={'col text-center'}>
          <button
            type={'button'}
            className={'btn btn-primary'}
            onClick={() => {
              setResultStr(replaceStr(replacedStr, targetSubstr, newSubstr));
            }}
          >
            ▼ Apply
          </button>
        </div>
      </div>
      <div className={'row form-floating'}>
        <textarea
          className={'form-control textarea'}
          defaultValue={resultStr}
          id="newTextarea"
          readOnly={true}
          style={styles.textArea}
        />
        <label htmlFor={'newTextarea'}>
          If you click apply button, replaced string will appear here.
        </label>
      </div>
    </div>
  );
};

const replaceStr = (
  replacedStr: string,
  targetSubstr: string,
  newSubstr: string,
): string => {
  const regex = new RegExp(targetSubstr, 'g');
  return replacedStr.replace(regex, newSubstr);
};

export default StringReplaceForm;
