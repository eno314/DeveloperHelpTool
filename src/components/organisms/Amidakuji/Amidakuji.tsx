"use client";

import React, { useCallback, useRef, useState } from "react";
import styles from "./Amidakuji.module.css";

interface Line {
  col: number; // The vertical line index starting from 0 (between col and col+1)
  row: number; // The horizontal row index
}

const MAX_LINES = 15;
const MIN_LINES = 2;
const ROWS = 20; // Number of possible horizontal line positions (slots)

const Amidakuji = (): React.JSX.Element => {
  const [numLines, setNumLines] = useState<number>(5);
  const [inputNumLines, setInputNumLines] = useState<string>("5");
  const [topLabels, setTopLabels] = useState<string[]>(
    Array.from({ length: 5 }, (_, i) => String(i + 1)),
  );
  const [bottomLabels, setBottomLabels] = useState<string[]>(
    Array.from({ length: 5 }, (_, i) => String(i + 1)),
  );
  const [horizontalLines, setHorizontalLines] = useState<Line[]>([]);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [selectedStart, setSelectedStart] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Handle number of lines change
  const handleNumLinesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInputNumLines(inputValue);

    let value = parseInt(inputValue, 10);
    if (isNaN(value)) {
      value = MIN_LINES;
    }

    // Still let them type e.g. '1', but visually clamp for the board state
    const clampedValue = Math.max(MIN_LINES, Math.min(value, MAX_LINES));

    if (clampedValue !== numLines) {
      setNumLines(clampedValue);

      // Update labels to match the new size, keeping existing ones
      setTopLabels((prev) => {
        const newLabels = [...prev];
        if (newLabels.length < clampedValue) {
          for (let i = newLabels.length; i < clampedValue; i++) {
            newLabels.push(String(i + 1));
          }
        } else {
          newLabels.length = clampedValue;
        }
        return newLabels;
      });

      setBottomLabels((prev) => {
        const newLabels = [...prev];
        if (newLabels.length < clampedValue) {
          for (let i = newLabels.length; i < clampedValue; i++) {
            newLabels.push(String(i + 1));
          }
        } else {
          newLabels.length = clampedValue;
        }
        return newLabels;
      });

      // Reset state on board size change
      setHorizontalLines([]);
      setIsGenerated(false);
      setSelectedStart(null);
    }
  };

  const handleNumLinesBlur = () => {
    let value = parseInt(inputNumLines, 10);
    if (isNaN(value)) {
      value = MIN_LINES;
    }
    const clampedValue = Math.max(MIN_LINES, Math.min(value, MAX_LINES));
    setInputNumLines(String(clampedValue));
  };

  const handleLabelChange = (index: number, value: string, isTop: boolean) => {
    if (isTop) {
      const newLabels = [...topLabels];
      newLabels[index] = value;
      setTopLabels(newLabels);
    } else {
      const newLabels = [...bottomLabels];
      newLabels[index] = value;
      setBottomLabels(newLabels);
    }
  };

  const generateLines = useCallback(() => {
    const newLines: Line[] = [];

    // For each possible row, randomly decide if we want lines
    for (let r = 0; r < ROWS; r++) {
      let c = 0;
      while (c < numLines - 1) {
        // Randomly place a line between col and col+1
        if (Math.random() > 0.6) {
          // 40% chance to have a line
          newLines.push({ col: c, row: r });
          // Skip the next column to prevent adjacent lines connecting directly
          c += 2;
        } else {
          c += 1;
        }
      }
    }

    setHorizontalLines(newLines);
    setIsGenerated(true);
    setSelectedStart(null); // Reset selection on new generation
  }, [numLines]);

  const handleClear = useCallback(() => {
    setHorizontalLines([]);
    setIsGenerated(false);
    setSelectedStart(null);
    setTopLabels(Array.from({ length: numLines }, (_, i) => String(i + 1)));
    setBottomLabels(Array.from({ length: numLines }, (_, i) => String(i + 1)));
  }, [numLines]);

  // Calculate the path for a given start index
  const getPath = (startIndex: number): { col: number; row: number }[] => {
    const path: { col: number; row: number }[] = [];
    let currentCol = startIndex;

    // Start point
    path.push({ col: currentCol, row: -1 });

    // Iterate through rows to trace the path
    for (let r = 0; r <= ROWS; r++) {
      // Find if there's a horizontal line connected to currentCol at this row
      const lineRight = horizontalLines.find(
        (l) => l.row === r && l.col === currentCol,
      );
      const lineLeft = horizontalLines.find(
        (l) => l.row === r && l.col === currentCol - 1,
      );

      if (lineRight) {
        // Move right
        path.push({ col: currentCol, row: r });
        currentCol += 1;
        path.push({ col: currentCol, row: r });
      } else if (lineLeft) {
        // Move left
        path.push({ col: currentCol, row: r });
        currentCol -= 1;
        path.push({ col: currentCol, row: r });
      }
    }

    // End point
    path.push({ col: currentCol, row: ROWS });

    return path;
  };

  const selectedPath = selectedStart !== null ? getPath(selectedStart) : null;

  // Render SVG based path logic
  const renderSVG = () => {
    const width = 100 * (numLines - 1);
    const height = 400;
    const paddingX = 50;
    const paddingY = 20;

    const rowSpacing = height / (ROWS + 1);
    const colSpacing = width / (numLines - 1 || 1);

    const getX = (col: number) => paddingX + col * colSpacing;
    const getY = (row: number) => paddingY + (row + 1) * rowSpacing;

    return (
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width + paddingX * 2} ${height + paddingY * 2}`}
        preserveAspectRatio="none"
        className={styles.svgContainer}
      >
        {/* Vertical Lines */}
        {Array.from({ length: numLines }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={getX(i)}
            y1={paddingY}
            x2={getX(i)}
            y2={paddingY + height}
            stroke="#ccc"
            strokeWidth="4"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* Horizontal Lines */}
        {isGenerated &&
          horizontalLines.map((line, i) => (
            <line
              key={`h-${i}`}
              x1={getX(line.col)}
              y1={getY(line.row)}
              x2={getX(line.col + 1)}
              y2={getY(line.row)}
              stroke="#ccc"
              strokeWidth="4"
              vectorEffect="non-scaling-stroke"
            />
          ))}

        {/* Highlighted Path */}
        {selectedPath && (
          <polyline
            points={selectedPath
              .map((p) => {
                const y = p.row === -1
                  ? paddingY
                  : p.row === ROWS
                  ? paddingY + height
                  : getY(p.row);
                return `${getX(p.col)},${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="red"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    );
  };

  return (
    <div className={styles.container}>
      <div className="mb-4">
        <label htmlFor="numLinesInput" className="form-label">
          Number of Lines (2-15):
        </label>
        <input
          type="number"
          id="numLinesInput"
          className="form-control"
          value={inputNumLines}
          min={MIN_LINES}
          max={MAX_LINES}
          onChange={handleNumLinesChange}
          onBlur={handleNumLinesBlur}
          style={{ maxWidth: "200px" }}
        />
        <div className="mt-3">
          <button type="button" className="btn btn-primary me-2" onClick={generateLines}>
            生成 (Generate)
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={handleClear}>
            クリア (Clear)
          </button>
        </div>
      </div>

      <div className={styles.amidakujiBoard} ref={containerRef}>
        {/* Top Labels */}
        <div className={styles.labelsRow}>
          {topLabels.map((label, i) => (
            <div key={`top-${i}`} className={styles.labelContainer}>
              <input
                type="text"
                className={`form-control ${styles.labelInput}`}
                value={label}
                onChange={(e) =>
                  handleLabelChange(i, e.target.value, true)}
                onClick={() =>
                  isGenerated && setSelectedStart(i)}
                readOnly={isGenerated}
                style={{
                  cursor: isGenerated ? "pointer" : "text",
                  borderColor: selectedStart === i ? "red" : undefined,
                  borderWidth: selectedStart === i ? "2px" : undefined,
                }}
              />
              {isGenerated && (
                <button type="button"
                  className="btn btn-sm btn-outline-danger mt-1"
                  onClick={() => setSelectedStart(i)}
                >
                  Select
                </button>
              )}
            </div>
          ))}
        </div>

        {/* The SVG area */}
        <div className={styles.svgWrapper}>{renderSVG()}</div>

        {/* Bottom Labels */}
        <div className={styles.labelsRow}>
          {bottomLabels.map((label, i) => {
            // Check if the current selected path ends here
            let isEndNode = false;
            if (selectedPath && selectedPath.length > 0) {
              const endPoint = selectedPath[selectedPath.length - 1];
              if (endPoint.col === i) {
                isEndNode = true;
              }
            }

            return (
              <div key={`bottom-${i}`} className={styles.labelContainer}>
                <input
                  type="text"
                  className={`form-control ${styles.labelInput}`}
                  value={label}
                  onChange={(e) => handleLabelChange(i, e.target.value, false)}
                  readOnly={isGenerated}
                  style={{
                    borderColor: isEndNode ? "red" : undefined,
                    borderWidth: isEndNode ? "2px" : undefined,
                    backgroundColor: isEndNode ? "#ffe6e6" : undefined,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Amidakuji;
