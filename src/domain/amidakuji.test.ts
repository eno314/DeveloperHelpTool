import { expect } from "@std/expect";
import { generateHorizontalLines, getPath } from "./amidakuji.ts";

Deno.test("generateHorizontalLines returns array of points within bounds", () => {
  const numLines = 5;
  const rows = 10;
  const lines = generateHorizontalLines(numLines, rows);

  expect(Array.isArray(lines)).toBe(true);

  for (const line of lines) {
    expect(line.col).toBeGreaterThanOrEqual(0);
    expect(line.col).toBeLessThan(numLines - 1);
    expect(line.row).toBeGreaterThanOrEqual(0);
    expect(line.row).toBeLessThan(rows);
  }
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
