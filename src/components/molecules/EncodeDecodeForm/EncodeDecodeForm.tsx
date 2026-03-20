"use client";

import React, { useId, useState } from "react";
import {
  EncodeDecodeMode,
  toDecodedText,
  toEncodedText,
} from "../../../utils/encodeDecodeUtils.ts";

const textAreaStyle = {
  height: 500,
};

const EncodeDecodeForm = (): React.JSX.Element => {
  const [mode, setMode] = useState<EncodeDecodeMode>("URL");
  const [decodedText, setDecodedText] = useState("");
  const [encodedText, setEncodedText] = useState("");

  const id = useId();

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value as EncodeDecodeMode);
    setDecodedText("");
    setEncodedText("");
  };

  const handleFileChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === "string") {
          setter(content);
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    };

  return (
    <div className="container">
      <div className="row mb-3">
        <div className="col-md-4">
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
            <option value="JSON">JSON</option>
          </select>
        </div>
      </div>

      <div className="row align-items-center mb-3">
        <div className="col-md-5">
          {mode === "JSON" && (
            <div className="mb-2">
              <label
                htmlFor={`left-upload-${id}`}
                className="form-label d-block mb-1"
              >
                Upload File to Encode
              </label>
              <input
                id={`left-upload-${id}`}
                type="file"
                accept=".json,.txt"
                className="form-control form-control-sm"
                onChange={handleFileChange(setDecodedText)}
                aria-label="Upload File to Encode"
              />
            </div>
          )}
          <div className="form-floating">
            <textarea
              id="encodingTextarea"
              className="form-control"
              style={textAreaStyle}
              value={decodedText}
              placeholder={mode === "Base64" ? "UTF-8" : ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setDecodedText(e.target.value);
              }}
            />
            <label htmlFor="encodingTextarea">
              {mode === "Base64"
                ? "Please input text you'd like to encode. (UTF-8)"
                : "Please input text you'd like to encode."}
            </label>
          </div>
        </div>

        <div className="col-md-2 text-center d-flex flex-column gap-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setEncodedText(toEncodedText(decodedText, mode));
            }}
          >
            Encoding ▶
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setDecodedText(toDecodedText(encodedText, mode));
            }}
          >
            ◀ Decoding
          </button>
        </div>

        <div className="col-md-5">
          {mode === "JSON" && (
            <div className="mb-2">
              <label
                htmlFor={`right-upload-${id}`}
                className="form-label d-block mb-1"
              >
                Upload File to Decode
              </label>
              <input
                id={`right-upload-${id}`}
                type="file"
                accept=".json,.txt"
                className="form-control form-control-sm"
                onChange={handleFileChange(setEncodedText)}
                aria-label="Upload File to Decode"
              />
            </div>
          )}
          <div className="form-floating">
            <textarea
              id="decodingTextarea"
              className="form-control"
              style={textAreaStyle}
              value={encodedText}
              placeholder="Please input text you'd like to decode."
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setEncodedText(e.target.value);
              }}
            />
            <label htmlFor="decodingTextarea">
              Please input text you&apos;d like to decode.
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncodeDecodeForm;
