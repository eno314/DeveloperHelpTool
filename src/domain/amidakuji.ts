export type Point = { col: number; row: number };

export const MAX_LINES = 15;
export const MIN_LINES = 2;
export const ROWS = 20;

export function generateHorizontalLines(
  numLines: number,
  rows: number,
  randomFn: () => number = Math.random,
): Point[] {
  const newLines: Point[] = [];
  for (let r = 0; r < rows; r++) {
    let c = 0;
    while (c < numLines - 1) {
      if (randomFn() > 0.6) {
        newLines.push({ col: c, row: r });
        c += 2;
      } else {
        c += 1;
      }
    }
  }
  return newLines;
}

export function getColPercent(col: number, numLines: number): number {
  if (numLines <= 1) return 50;
  return (col / (numLines - 1)) * 100;
}

export function getEndNodeArray(
  numLines: number,
  selectedPath: Point[] | null,
): boolean[] {
  const arr = Array(numLines).fill(false);
  if (selectedPath && selectedPath.length > 0) {
    const endPoint = selectedPath[selectedPath.length - 1];
    arr[endPoint.col] = true;
  }
  return arr;
}

export function generateSvgLinesHtml(
  numLines: number,
  horizontalLines: Point[],
  isGenerated: boolean,
  selectedPath: Point[] | null,
  height: number,
  rowSpacing: number,
  rows: number,
): string {
  let html = "";
  const getX = (col: number) => getColPercent(col, numLines);
  const getY = (row: number) => (row + 1) * rowSpacing;

  // Vertical lines
  for (let i = 0; i < numLines; i++) {
    html += `<line x1="${getX(i)}" y1="0" x2="${
      getX(i)
    }" y2="${height}" stroke="#ccc" stroke-width="4" vector-effect="non-scaling-stroke" />`;
  }
  // Horizontal lines
  if (isGenerated) {
    horizontalLines.forEach((line) => {
      html += `<line x1="${getX(line.col)}" y1="${getY(line.row)}" x2="${
        getX(line.col + 1)
      }" y2="${
        getY(line.row)
      }" stroke="#ccc" stroke-width="4" vector-effect="non-scaling-stroke" />`;
    });
  }
  // Selected Path
  if (selectedPath) {
    const points = selectedPath
      .map((p) => {
        const y = p.row === -1 ? 0 : p.row === rows ? height : getY(p.row);
        return `${getX(p.col)},${y}`;
      })
      .join(" ");
    html +=
      `<polyline points="${points}" fill="none" stroke="red" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />`;
  }
  return html;
}

export function getPath(
  startIndex: number,
  horizontalLines: Point[],
  rows: number,
): Point[] {
  const path: Point[] = [];
  let currentCol = startIndex;

  path.push({ col: currentCol, row: -1 });

  for (let r = 0; r <= rows; r++) {
    const lineRight = horizontalLines.find(
      (l) => l.row === r && l.col === currentCol,
    );
    const lineLeft = horizontalLines.find(
      (l) => l.row === r && l.col === currentCol - 1,
    );

    if (lineRight) {
      path.push({ col: currentCol, row: r });
      currentCol += 1;
      path.push({ col: currentCol, row: r });
    } else if (lineLeft) {
      path.push({ col: currentCol, row: r });
      currentCol -= 1;
      path.push({ col: currentCol, row: r });
    }
  }

  path.push({ col: currentCol, row: rows });
  return path;
}
