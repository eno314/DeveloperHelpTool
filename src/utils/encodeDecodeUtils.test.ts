import { expect } from "@std/expect";
import { toDecodedText, toEncodedText } from "./encodeDecodeUtils.ts";

Deno.test("toEncodedText with URL mode", () => {
  const result = toEncodedText("hello world", "URL");
  expect(result).toBe("hello%20world");
});

Deno.test("toDecodedText with URL mode", () => {
  const result = toDecodedText("hello%20world", "URL");
  expect(result).toBe("hello world");
});

Deno.test("toEncodedText with Base64 mode", () => {
  const result = toEncodedText("hello world", "Base64");
  expect(result).toBe("aGVsbG8gd29ybGQ=");
});

Deno.test("toDecodedText with Base64 mode", () => {
  const result = toDecodedText("aGVsbG8gd29ybGQ=", "Base64");
  expect(result).toBe("hello world");
});

Deno.test("toEncodedText with JSON mode", () => {
  const result = toEncodedText('{"message": "hello world"}', "JSON");
  expect(result).toBe('{"message":"hello world"}');
});

Deno.test("toDecodedText with JSON mode", () => {
  const result = toDecodedText('{"message":"hello world"}', "JSON");
  expect(result).toBe('{\n  "message": "hello world"\n}');
});

Deno.test("toEncodedText with invalid JSON mode", () => {
  const result = toEncodedText('{"message": "hello world"', "JSON");
  expect(result).toMatch(/^can not encode\./);
});

Deno.test("toDecodedText with invalid JSON mode", () => {
  const result = toDecodedText('{"message":"hello world"', "JSON");
  expect(result).toMatch(/^can not decode\./);
});

Deno.test("toDecodedText with invalid Base64 mode", () => {
  const result = toDecodedText("aGVsbG8gd29ybGQ.invalid", "Base64");
  expect(result).toMatch(/^can not decode\./);
});
