import { diffLines, Change as DiffResult } from "../utils/diff.ts";

export type JsonCompareResult = {
  success: true;
  differences: DiffResult[];
} | {
  success: false;
  error: string;
};

/**
 * Compares two JSON strings and returns the differences.
 * If either JSON string is invalid, it returns an error message.
 *
 * @param leftJson The left JSON string
 * @param rightJson The right JSON string
 * @returns An object containing either the differences or an error message
 */
export function compareJson(leftJson: string, rightJson: string): JsonCompareResult {
  let parsedLeft;
  let parsedRight;

  try {
    parsedLeft = JSON.parse(leftJson);
  } catch {
    return { success: false, error: "Left JSON is invalid." };
  }

  try {
    parsedRight = JSON.parse(rightJson);
  } catch {
    return { success: false, error: "Right JSON is invalid." };
  }

  const formattedLeft = JSON.stringify(parsedLeft, null, 2);
  const formattedRight = JSON.stringify(parsedRight, null, 2);

  const differences = diffLines(formattedLeft, formattedRight);

  return { success: true, differences };
}
