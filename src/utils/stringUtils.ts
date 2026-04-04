/**
 * Replaces all occurrences of a target substring with a new substring.
 *
 * @param replacedStr The original string.
 * @param targetSubstr The substring or regular expression pattern to replace.
 * @param newSubstr The string to replace the target substring with.
 * @returns The resulting string after replacement.
 */
/**
 * Calculates the UTF-8 byte length of a given string.
 *
 * @param str The input string.
 * @returns The byte length of the string in UTF-8 encoding.
 */
export const countBytes = (str: string): number => {
  return new TextEncoder().encode(str).length;
};

export const replaceStr = (
  replacedStr: string,
  targetSubstr: string,
  newSubstr: string,
): string => {
  if (!targetSubstr || targetSubstr.length > 100) {
    return replacedStr;
  }
  try {
    const regex = new RegExp(targetSubstr, "g");
    return replacedStr.replace(regex, newSubstr);
  } catch {
    // If targetSubstr is an invalid regular expression, fallback to simple string replace
    const regex = new RegExp(
      targetSubstr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "g",
    );
    return replacedStr.replace(regex, newSubstr);
  }
};
