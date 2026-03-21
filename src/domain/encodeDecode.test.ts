import { expect } from "@std/expect";
import {
  getEncodingLabelText,
  getEncodingPlaceholderText,
  getShowUploadContainers,
  toDecodedText,
  toEncodedText,
} from "./encodeDecode.ts";

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

Deno.test("getShowUploadContainers returns true for JSON mode", () => {
  expect(getShowUploadContainers("JSON")).toBe(true);
});

Deno.test("getShowUploadContainers returns false for URL mode", () => {
  expect(getShowUploadContainers("URL")).toBe(false);
});

Deno.test("getShowUploadContainers returns false for Base64 mode", () => {
  expect(getShowUploadContainers("Base64")).toBe(false);
});

Deno.test("getEncodingLabelText returns correct label for Base64 mode", () => {
  expect(getEncodingLabelText("Base64")).toBe(
    "Please input text you'd like to encode. (UTF-8)",
  );
});

Deno.test("getEncodingLabelText returns correct label for URL mode", () => {
  expect(getEncodingLabelText("URL")).toBe(
    "Please input text you'd like to encode.",
  );
});

Deno.test("getEncodingLabelText returns correct label for JSON mode", () => {
  expect(getEncodingLabelText("JSON")).toBe(
    "Please input text you'd like to encode.",
  );
});

Deno.test("getEncodingPlaceholderText returns correct placeholder for Base64 mode", () => {
  expect(getEncodingPlaceholderText("Base64")).toBe("UTF-8");
});

Deno.test("getEncodingPlaceholderText returns empty string for URL mode", () => {
  expect(getEncodingPlaceholderText("URL")).toBe("");
});

Deno.test("getEncodingPlaceholderText returns empty string for JSON mode", () => {
  expect(getEncodingPlaceholderText("JSON")).toBe("");
});
