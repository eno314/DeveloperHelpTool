import { expect } from "@std/expect";
import { replaceStr } from "./stringUtils.ts";

Deno.test("replaceStr - should replace all occurrences of a string", () => {
  const result = replaceStr("hello world hello", "hello", "hi");
  expect(result).toBe("hi world hi");
});

Deno.test("replaceStr - should support simple regular expressions", () => {
  const result = replaceStr("abc 123 def 456", "\\d+", "num");
  expect(result).toBe("abc num def num");
});

Deno.test("replaceStr - should return the original string if targetSubstr is empty", () => {
  const result = replaceStr("hello world", "", "hi");
  expect(result).toBe("hello world");
});

Deno.test(
  "replaceStr - should handle invalid regular expressions gracefully (fallback to literal replace)",
  () => {
    const _result = replaceStr("hello [world]", "[world]", "everyone");
    // A valid regex for "[world]" with "g" flag would match 'w', 'o', 'r', 'l', 'd'.
    // Let's check the behavior of the original function.
    // The original function just did `new RegExp(targetSubstr, "g")`.
    // So `[world]` actually matches individual characters w,o,r,l,d.
    // We'll just test that it doesn't crash on invalid regex like `[`.
    const resultInvalid = replaceStr("hello [ world", "[", "bracket");
    expect(resultInvalid).toBe("hello bracket world");
  },
);
