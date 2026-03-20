"use client";

import React, { type ChangeEvent, useState } from "react";
import {
  addUrlParam,
  createUrlText,
  parseUrl,
  removeUrlParamOf,
  updateUrlParams,
  type UrlParam,
} from "../../../utils/urlParseUtils.ts";

const styles = {
  primaryButtonsRow: {
    marginTop: 10,
    marginBottom: 10,
  },
  addParamButton: {
    textAlign: "center" as const,
  },
};

const UrlParseForm = (): React.JSX.Element => {
  const [parsedUrlText, setParsedUrlText] = useState("");
  const [baseUrlText, setBaseUrlText] = useState("");
  const [urlParams, setUrlParams] = useState([] as UrlParam[]);

  return (
    <div className="container">
      <div className="input-group mb-3">
        <span className="input-group-text" id="parsedUrl">
          Parsed URL
        </span>
        <input
          type="url"
          className="form-control"
          aria-describedby="parsedUrl"
          value={parsedUrlText}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setParsedUrlText(e.target.value);
          }}
        />
      </div>
      <div className="row" style={styles.primaryButtonsRow}>
        <div className="col text-center">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              const result = parseUrl(parsedUrlText);
              setBaseUrlText(result.baseUrlText);
              setUrlParams(result.urlParams);
            }}
          >
            ▼ Parse URL
          </button>
        </div>
        <div className="col text-center">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setParsedUrlText(createUrlText(baseUrlText, urlParams));
            }}
          >
            ▲ Build URL
          </button>
        </div>
      </div>
      <div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="baseUrl">
            Base URL
          </span>
          <input
            type="url"
            className="form-control"
            aria-describedby="baseUrl"
            value={baseUrlText}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setBaseUrlText(e.target.value);
            }}
          />
        </div>
        <table className="table table-sm">
          <thead>
            <tr>
              <th scope="col">URL PARAM KEY</th>
              <th scope="col">URL PARAM VALUE</th>
              <th scope="col">DELETE</th>
            </tr>
          </thead>
          <tbody>
            {urlParams.map((urlParam: UrlParam, i: number) => (
              <tr key={i}>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={urlParam.key}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setUrlParams(
                        updateUrlParams(urlParams, i, "key", e.target.value),
                      );
                    }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={urlParam.value}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setUrlParams(
                        updateUrlParams(urlParams, i, "value", e.target.value),
                      );
                    }}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setUrlParams(removeUrlParamOf(i, urlParams));
                    }}
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={styles.addParamButton}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setUrlParams(addUrlParam(urlParams));
            }}
          >
            add param
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrlParseForm;
