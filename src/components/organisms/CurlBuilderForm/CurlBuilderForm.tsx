"use client";

import React, { useEffect, useMemo, useState } from "react";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface Header {
  key: string;
  value: string;
}

const CurlBuilderForm = (): React.JSX.Element => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<Method>("GET");
  const [headers, setHeaders] = useState<Header[]>([]);
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate curl command
  const curlCommand = useMemo(() => {
    let cmd = "curl";

    // Method
    if (method !== "GET") {
      cmd += ` -X ${method}`;
    }

    // URL
    if (url) {
      cmd += ` "${url}"`;
    } else {
      cmd += ' ""';
    }

    // Headers
    for (const h of headers) {
      if (h.key || h.value) {
        cmd += ` -H "${h.key}: ${h.value}"`;
      }
    }

    // Body
    if (["POST", "PUT", "PATCH"].includes(method) && body) {
      // Escape single quotes: ' -> '\''
      const escapedBody = body.replace(/'/g, "'\\''");
      cmd += ` -d '${escapedBody}'`;
    }

    return cmd;
  }, [url, method, headers, body]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(curlCommand);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const removeHeader = (index: number) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);
  };

  const updateHeader = (
    index: number,
    field: "key" | "value",
    newValue: string,
  ) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: newValue };
    setHeaders(newHeaders);
  };

  return (
    <div className="container">
      <div className="row mb-3">
        <div className="col-md-2">
          <label htmlFor="methodSelect" className="form-label">
            Method
          </label>
          <select
            id="methodSelect"
            className="form-select"
            value={method}
            onChange={(e) => setMethod(e.target.value as Method)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>
        <div className="col-md-10">
          <label htmlFor="urlInput" className="form-label">
            URL
          </label>
          <input
            id="urlInput"
            type="text"
            className="form-control"
            value={url}
            placeholder="https://example.com/api?query=1"
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="form-label mb-0">Headers</label>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={addHeader}
            >
              + Add Header
            </button>
          </div>
          {headers.length === 0 && (
            <div className="text-muted small mb-2">No headers added.</div>
          )}
          {headers.map((header, index) => (
            <div key={index} className="row mb-2">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Key (e.g., Content-Type)"
                  value={header.key}
                  onChange={(e) => updateHeader(index, "key", e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Value (e.g., application/json)"
                  value={header.value}
                  onChange={(e) => updateHeader(index, "value", e.target.value)}
                />
              </div>
              <div className="col-md-1 d-flex align-items-center">
                <button
                  type="button"
                  className="btn btn-sm btn-danger w-100"
                  onClick={() => removeHeader(index)}
                  aria-label="Remove header"
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {["POST", "PUT", "PATCH"].includes(method) && (
        <div className="row mb-3 form-floating">
          <textarea
            id="bodyTextarea"
            className="form-control"
            style={{ height: 150 }}
            value={body}
            placeholder="Request Body"
            onChange={(e) => setBody(e.target.value)}
          />
          <label htmlFor="bodyTextarea" style={{ left: "12px" }}>
            Body
          </label>
        </div>
      )}

      <div className="row mb-3 mt-4">
        <div className="col-12">
          <label className="form-label fw-bold">Generated curl Command</label>
          <div className="position-relative">
            <textarea
              className="form-control bg-light"
              style={{ height: 120, fontFamily: "monospace" }}
              readOnly
              value={curlCommand}
            />
            <button
              type="button"
              className={`btn btn-sm position-absolute top-0 end-0 m-2 ${
                copied ? "btn-success" : "btn-primary"
              }`}
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurlBuilderForm;
