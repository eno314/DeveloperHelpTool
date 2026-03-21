import { diffLines, Change as DiffResult } from "../utils/diff.ts";

export interface JsonCompareResult {
  errorMessage: string;
  leftDifferences: DiffResult[];
  rightDifferences: DiffResult[];
}

/**
 * Compares two JSON strings and returns the differences separated for left and right views.
 * If either JSON string is invalid, it returns an error message.
 *
 * @param leftJson The left JSON string
 * @param rightJson The right JSON string
 * @returns An object containing separated differences or an error message
 */
export function compareJson(leftJson: string, rightJson: string): JsonCompareResult {
  let parsedLeft;
  let parsedRight;

  try {
    parsedLeft = JSON.parse(leftJson);
  } catch {
    return { errorMessage: "Left JSON is invalid.", leftDifferences: [], rightDifferences: [] };
  }

  try {
    parsedRight = JSON.parse(rightJson);
  } catch {
    return { errorMessage: "Right JSON is invalid.", leftDifferences: [], rightDifferences: [] };
  }

  const formattedLeft = JSON.stringify(parsedLeft, null, 2);
  const formattedRight = JSON.stringify(parsedRight, null, 2);

  const differences = diffLines(formattedLeft, formattedRight);

  // Left view should not contain "added" lines
  const leftDifferences = differences.filter((part) => !part.added);

  // Right view should not contain "removed" lines
  const rightDifferences = differences.filter((part) => !part.removed);

  return { errorMessage: "", leftDifferences, rightDifferences };
}
