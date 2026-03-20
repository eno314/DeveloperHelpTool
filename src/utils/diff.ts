/**
 * Represents a change in a string comparison.
 */
export interface Change {
  value: string;
  added?: boolean;
  removed?: boolean;
}

/**
 * A simple line-based diff implementation.
 * It compares two strings line by line and returns an array of changes.
 * This is a minimal implementation suitable for basic JSON diffing,
 * returning the exact interface expected by `JSONCompareForm`.
 *
 * @param oldStr The original string
 * @param newStr The new string
 * @returns An array of Change objects
 */
export function diffLines(oldStr: string, newStr: string): Change[] {
  // Normalize line endings and split by newline, keeping the newline character
  const oldLines = splitIntoLines(oldStr);
  const newLines = splitIntoLines(newStr);

  const changes: Change[] = [];

  // Use a simple LCS (Longest Common Subsequence) based approach or a simplified O(ND) algorithm.
  // For simplicity and to avoid complex dependencies, we implement a basic Myers diff algorithm.
  const diffs = myersDiff(oldLines, newLines);

  // Combine adjacent identical change types into single Change objects
  for (const diff of diffs) {
    const lastChange = changes[changes.length - 1];

    if (
      lastChange &&
      lastChange.added === diff.added &&
      lastChange.removed === diff.removed
    ) {
      lastChange.value += diff.value;
    } else {
      changes.push({...diff});
    }
  }

  return changes;
}

function splitIntoLines(str: string): string[] {
  if (str === '') return [];
  const lines = str.split(/\r?\n/);
  return lines
    .map((line, index) => (index < lines.length - 1 ? line + '\n' : line))
    .filter(line => line.length > 0);
}

/**
 * Basic Myers diff algorithm implementation.
 */
function myersDiff(oldLines: string[], newLines: string[]): Change[] {
  const n = oldLines.length;
  const m = newLines.length;
  const max = n + m;
  const v: {[k: number]: number} = {1: 0};
  const trace: {[k: number]: number}[] = [];

  for (let d = 0; d <= max; d++) {
    const vCopy: {[k: number]: number} = {};
    for (const key in v) {
      vCopy[key] = v[key];
    }
    trace.push(vCopy);

    for (let k = -d; k <= d; k += 2) {
      let x: number;
      const down = k === -d || (k !== d && v[k - 1] < v[k + 1]);

      if (down) {
        x = v[k + 1];
      } else {
        x = v[k - 1] + 1;
      }

      let y = x - k;

      while (x < n && y < m && oldLines[x] === newLines[y]) {
        x++;
        y++;
      }

      v[k] = x;

      if (x >= n && y >= m) {
        return buildScript(trace, oldLines, newLines);
      }
    }
  }

  return [];
}

function buildScript(
  trace: {[k: number]: number}[],
  oldLines: string[],
  newLines: string[],
): Change[] {
  const script: Change[] = [];
  let x = oldLines.length;
  let y = newLines.length;

  for (let d = trace.length - 1; d >= 0; d--) {
    const v = trace[d];
    const k = x - y;

    const down = k === -d || (k !== d && v[k - 1] < v[k + 1]);
    const kPrev = down ? k + 1 : k - 1;

    const xPrev = v[kPrev];
    const yPrev = xPrev - kPrev;

    while (x > xPrev && y > yPrev) {
      script.push({value: oldLines[x - 1]});
      x--;
      y--;
    }

    if (d > 0) {
      if (down) {
        script.push({value: newLines[yPrev], added: true});
      } else {
        script.push({value: oldLines[xPrev], removed: true});
      }
      x = xPrev;
      y = yPrev;
    }
  }

  return script.reverse();
}
