export type Point = { col: number; row: number };

export function generateHorizontalLines(
  numLines: number,
  rows: number,
): Point[] {
  const newLines: Point[] = [];
  for (let r = 0; r < rows; r++) {
    let c = 0;
    while (c < numLines - 1) {
      if (Math.random() > 0.6) {
        newLines.push({ col: c, row: r });
        c += 2;
      } else {
        c += 1;
      }
    }
  }
  return newLines;
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
