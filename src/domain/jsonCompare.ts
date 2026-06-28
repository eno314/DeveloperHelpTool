import { Change as DiffResult, diffLines } from "../utils/diff.ts";

export interface JsonCompareResult {
  errorMessage: string;
  leftDifferences: DiffResult[];
  rightDifferences: DiffResult[];
  isEqual: boolean;
  isEqualIgnoringKeyOrder: boolean;
}

/**
 * Recursively sorts the keys of an object.
 */
function sortObjectKeys(value: unknown): unknown {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(sortObjectKeys);
  }
  const obj = value as Record<string, unknown>;
  const sortedKeys = Object.keys(obj).sort();
  const sortedObj: Record<string, unknown> = {};
  for (const key of sortedKeys) {
    sortedObj[key] = sortObjectKeys(obj[key]);
  }
  return sortedObj;
}

/**
 * Compares two JSON strings and returns the differences separated for left and right views.
 * If either JSON string is invalid, it returns an error message.
 *
 * @param leftJson The left JSON string
 * @param rightJson The right JSON string
 * @returns An object containing separated differences or an error message
 */
export function compareJson(
  leftJson: string,
  rightJson: string,
): JsonCompareResult {
  let parsedLeft;
  let parsedRight;

  try {
    parsedLeft = JSON.parse(leftJson);
  } catch {
    return {
      errorMessage: "Left JSON is invalid.",
      leftDifferences: [],
      rightDifferences: [],
      isEqual: false,
      isEqualIgnoringKeyOrder: false,
    };
  }

  try {
    parsedRight = JSON.parse(rightJson);
  } catch {
    return {
      errorMessage: "Right JSON is invalid.",
      leftDifferences: [],
      rightDifferences: [],
      isEqual: false,
      isEqualIgnoringKeyOrder: false,
    };
  }

  const formattedLeft = JSON.stringify(parsedLeft, null, 2);
  const formattedRight = JSON.stringify(parsedRight, null, 2);

  const isEqual = formattedLeft === formattedRight;

  const sortedLeft = sortObjectKeys(parsedLeft);
  const sortedRight = sortObjectKeys(parsedRight);
  const formattedSortedLeft = JSON.stringify(sortedLeft, null, 2);
  const formattedSortedRight = JSON.stringify(sortedRight, null, 2);

  const isEqualIgnoringKeyOrder = formattedSortedLeft === formattedSortedRight;

  const differences = diffLines(formattedLeft, formattedRight);

  // Left view should not contain "added" lines
  const leftDifferences = differences.filter((part) => !part.added);

  // Right view should not contain "removed" lines
  const rightDifferences = differences.filter((part) => !part.removed);

  return {
    errorMessage: "",
    leftDifferences,
    rightDifferences,
    isEqual,
    isEqualIgnoringKeyOrder,
  };
}
