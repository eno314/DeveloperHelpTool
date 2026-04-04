import { expect } from "@std/expect";
import {
  generateHorizontalLines,
  generateSvgLinesHtml,
  getColPercent,
  getEndNodeArray,
  getPath,
} from "../../src/domain/amidakuji.ts";

Deno.test("generateHorizontalLines returns array of points within bounds", () => {
  const numLines = 5;
  const rows = 10;
  // Use a deterministic random function for testing
  let counter = 0;
  const mockRandom = () => {
    counter++;
    return counter % 2 === 0 ? 0.7 : 0.4;
  };
  const lines = generateHorizontalLines(numLines, rows, mockRandom);

  expect(Array.isArray(lines)).toBe(true);
  expect(lines.length).toBeGreaterThan(0); // Should have generated some lines

  for (const line of lines) {
    expect(line.col).toBeGreaterThanOrEqual(0);
    expect(line.col).toBeLessThan(numLines - 1);
    expect(line.row).toBeGreaterThanOrEqual(0);
    expect(line.row).toBeLessThan(rows);
  }
});

Deno.test("generateHorizontalLines uses Math.random by default", () => {
  const numLines = 3;
  const rows = 5;
  const lines = generateHorizontalLines(numLines, rows);
  expect(Array.isArray(lines)).toBe(true);
});

Deno.test("getPath calculates correct path without lines", () => {
  const rows = 5;
  const lines: { col: number; row: number }[] = [];

  const path = getPath(1, lines, rows);

  expect(path[0]).toEqual({ col: 1, row: -1 });
  expect(path[path.length - 1]).toEqual({ col: 1, row: rows });

  for (const point of path) {
    expect(point.col).toBe(1);
  }
});

Deno.test("getPath calculates correct path with lines", () => {
  const rows = 3;
  // Lines:
  // Col 0: row 0 (moves 0 -> 1)
  // Col 1: row 1 (moves 1 -> 2)
  // Col 1: row 2 (moves 2 -> 1)
  const lines = [
    { col: 0, row: 0 },
    { col: 1, row: 1 },
    { col: 1, row: 2 },
  ];

  // Starting at col 0
  const path0 = getPath(0, lines, rows);
  // Row -1: col 0
  // Row 0: hit right line (col 0 -> 1)
  // Row 1: hit right line (col 1 -> 2)
  // Row 2: no line at col 2, but line left at col 1 -> moves 2 -> 1
  // Row 3 (end): col 1

  expect(path0[path0.length - 1]).toEqual({ col: 1, row: rows });
});

Deno.test("getColPercent calculates correct percentage", () => {
  expect(getColPercent(0, 5)).toBe(0);
  expect(getColPercent(2, 5)).toBe(50);
  expect(getColPercent(4, 5)).toBe(100);

  // Edge case: numLines <= 1
  expect(getColPercent(0, 1)).toBe(50);
  expect(getColPercent(0, 0)).toBe(50);
});

Deno.test("getEndNodeArray returns correct boolean array", () => {
  const numLines = 5;

  // Case: no path selected
  let result = getEndNodeArray(numLines, null);
  expect(result).toEqual([false, false, false, false, false]);

  // Case: empty path array
  result = getEndNodeArray(numLines, []);
  expect(result).toEqual([false, false, false, false, false]);

  // Case: path ends at col 2
  const path = [{ col: 0, row: 0 }, { col: 2, row: 5 }];
  result = getEndNodeArray(numLines, path);
  expect(result).toEqual([false, false, true, false, false]);
});

Deno.test("generateSvgLinesHtml generates correct HTML string", () => {
  const numLines = 3;
  const rows = 2;
  const horizontalLines = [{ col: 0, row: 0 }, { col: 1, row: 1 }];
  const height = 400;
  const rowSpacing = height / (rows + 1); // 400 / 3 = 133.33...

  // Case 1: isGenerated is false, selectedPath is null
  let html = generateSvgLinesHtml(
    numLines,
    horizontalLines,
    false,
    null,
    height,
    rowSpacing,
    rows,
  );

  // Should contain 3 vertical lines (col 0, 1, 2)
  expect(html).toContain('x1="0" y1="0" x2="0" y2="400"'); // col 0 (0%)
  expect(html).toContain('x1="50" y1="0" x2="50" y2="400"'); // col 1 (50%)
  expect(html).toContain('x1="100" y1="0" x2="100" y2="400"'); // col 2 (100%)

  // Should NOT contain horizontal lines since isGenerated is false
  expect(html).not.toContain('y1="133.33');
  // Should NOT contain polyline
  expect(html).not.toContain("<polyline");

  // Case 2: isGenerated is true
  html = generateSvgLinesHtml(
    numLines,
    horizontalLines,
    true,
    null,
    height,
    rowSpacing,
    rows,
  );

  // Should contain horizontal lines
  // col 0 (0%) to col 1 (50%) at row 0 (y = 133.33...)
  expect(html).toContain(
    `x1="0" y1="${rowSpacing}" x2="50" y2="${rowSpacing}"`,
  );
  // col 1 (50%) to col 2 (100%) at row 1 (y = 266.66...)
  expect(html).toContain(
    `x1="50" y1="${rowSpacing * 2}" x2="100" y2="${rowSpacing * 2}"`,
  );

  // Case 3: selectedPath is present
  const path = [
    { col: 0, row: -1 },
    { col: 0, row: 0 },
    { col: 1, row: 0 },
    { col: 1, row: rows },
  ];
  html = generateSvgLinesHtml(
    numLines,
    horizontalLines,
    true,
    path,
    height,
    rowSpacing,
    rows,
  );

  // Should contain polyline with expected points
  expect(html).toContain("<polyline");
  const expectedPoints = `0,0 0,${rowSpacing} 50,${rowSpacing} 50,400`;
  expect(html).toContain(`points="${expectedPoints}"`);
});
