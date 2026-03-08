'use client';

import React, {useState, useId} from 'react';
import * as diff from 'diff';
import styles from './JSONCompareForm.module.css';

const JSONCompareForm = (): React.JSX.Element => {
  const [leftInput, setLeftInput] = useState<string>('');
  const [rightInput, setRightInput] = useState<string>('');
  const [diffResult, setDiffResult] = useState<diff.Change[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const id = useId();

  const handleCompare = () => {
    setError(null);
    setDiffResult(null);

    let parsedLeft: unknown;
    let parsedRight: unknown;

    try {
      parsedLeft = JSON.parse(leftInput);
    } catch {
      setError('Left JSON is invalid.');
      return;
    }

    try {
      parsedRight = JSON.parse(rightInput);
    } catch {
      setError('Right JSON is invalid.');
      return;
    }

    const formattedLeft = JSON.stringify(parsedLeft, null, 2);
    const formattedRight = JSON.stringify(parsedRight, null, 2);

    const differences = diff.diffLines(formattedLeft, formattedRight);
    setDiffResult(differences);
  };

  return (
    <div className="container mt-4">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor={`left-json-${id}`} className="form-label">
            Left JSON
          </label>
          <textarea
            id={`left-json-${id}`}
            className="form-control"
            rows={10}
            value={leftInput}
            onChange={e => setLeftInput(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor={`right-json-${id}`} className="form-label">
            Right JSON
          </label>
          <textarea
            id={`right-json-${id}`}
            className="form-control"
            rows={10}
            value={rightInput}
            onChange={e => setRightInput(e.target.value)}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col text-center">
          <button className="btn btn-primary" onClick={handleCompare}>
            Compare
          </button>
        </div>
      </div>

      {diffResult && (
        <div className="row">
          <div className="col-md-6">
            <h4>Left Result</h4>
            <pre className={`form-control ${styles.diffContainer}`}>
              {diffResult.map((part, index) => {
                // If it's an addition in the right side, it shouldn't show up in the left side result natively
                // Or maybe it shows up as empty space if we want to align them.
                // Standard behavior for left side: show original (removed + unchanged)
                if (part.added) {
                  return null;
                }
                const className = part.removed ? styles.removed : '';
                return (
                  <span key={index} className={className}>
                    {part.value}
                  </span>
                );
              })}
            </pre>
          </div>
          <div className="col-md-6">
            <h4>Right Result</h4>
            <pre className={`form-control ${styles.diffContainer}`}>
              {diffResult.map((part, index) => {
                // Standard behavior for right side: show new (added + unchanged)
                if (part.removed) {
                  return null;
                }
                const className = part.added ? styles.added : '';
                return (
                  <span key={index} className={className}>
                    {part.value}
                  </span>
                );
              })}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default JSONCompareForm;
