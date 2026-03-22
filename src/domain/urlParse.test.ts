import { expect } from "@std/expect";
import {
  addUrlParam,
  createUrlText,
  parseUrl,
  removeUrlParamOf,
  updateUrlParams,
} from "./urlParse.ts";

Deno.test("urlParse - parseUrl", () => {
  const result = parseUrl("https://example.com/path?key1=value1&key2=value2");
  expect(result.baseUrlText).toBe("https://example.com/path");
  expect(result.urlParams).toEqual([
    { key: "key1", value: "value1" },
    { key: "key2", value: "value2" },
  ]);
});

Deno.test("urlParse - parseUrl with multibyte chars", () => {
  const urlToParse = `https://example.com/path?key1=${
    encodeURIComponent("あいうえお")
  }`;
  const result = parseUrl(urlToParse);
  expect(result.baseUrlText).toBe("https://example.com/path");
  expect(result.urlParams).toEqual([
    { key: "key1", value: "あいうえお" },
  ]);
});

Deno.test("urlParse - parseUrl with invalid url", () => {
  const result = parseUrl("not_a_valid_url");
  expect(result.baseUrlText).toBe("");
  expect(result.urlParams).toEqual([]);
});

Deno.test("urlParse - createUrlText", () => {
  const baseUrlText = "https://example.com/path";
  const urlParams = [
    { key: "key1", value: "value1" },
    { key: "key2", value: "value2" },
  ];
  const result = createUrlText(baseUrlText, urlParams);
  expect(result).toBe("https://example.com/path?key1=value1&key2=value2");
});

Deno.test("urlParse - createUrlText with multibyte chars", () => {
  const baseUrlText = "https://example.com/path";
  const urlParams = [
    { key: "key1", value: "あいうえお" },
  ];
  const result = createUrlText(baseUrlText, urlParams);
  expect(result).toBe(
    `https://example.com/path?key1=${encodeURIComponent("あいうえお")}`,
  );
});

Deno.test("urlParse - createUrlText with empty params", () => {
  const baseUrlText = "https://example.com/path";
  const urlParams = [
    { key: "", value: "value1" }, // Invalid key
    { key: "key2", value: "" }, // Invalid value
  ];
  const result = createUrlText(baseUrlText, urlParams);
  expect(result).toBe("https://example.com/path");
});

Deno.test("urlParse - updateUrlParams", () => {
  const baseParams = [
    { key: "key1", value: "value1" },
  ];
  const result = updateUrlParams(baseParams, 0, "value", "newValue1");
  expect(result).toEqual([{ key: "key1", value: "newValue1" }]);
});

Deno.test("urlParse - removeUrlParamOf", () => {
  const baseParams = [
    { key: "key1", value: "value1" },
    { key: "key2", value: "value2" },
  ];
  const result = removeUrlParamOf(0, baseParams);
  expect(result).toEqual([{ key: "key2", value: "value2" }]);
});

Deno.test("urlParse - addUrlParam", () => {
  const baseParams = [
    { key: "key1", value: "value1" },
  ];
  const result = addUrlParam(baseParams);
  expect(result).toEqual([
    { key: "key1", value: "value1" },
    { key: "", value: "" },
  ]);
});
