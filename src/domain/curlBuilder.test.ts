import { expect } from "@std/expect";
import { buildCurlCommand } from "./curlBuilder.ts";

Deno.test("buildCurlCommand defaults to GET", () => {
  const result = buildCurlCommand("GET", "https://example.com", [], "");
  expect(result).toBe('curl "https://example.com"');
});

Deno.test("buildCurlCommand with method POST", () => {
  const result = buildCurlCommand("POST", "https://example.com", [], "");
  expect(result).toBe('curl -X POST "https://example.com"');
});

Deno.test("buildCurlCommand escapes body with single quotes", () => {
  const body = "It's a test";
  const result = buildCurlCommand("POST", "https://example.com", [], body);
  expect(result).toBe("curl -X POST \"https://example.com\" -d 'It'\\''s a test'");
});

Deno.test("buildCurlCommand includes headers", () => {
  const headers = [
    { key: "Content-Type", value: "application/json" },
    { key: "Authorization", value: "Bearer token" },
  ];
  const result = buildCurlCommand("GET", "https://api.example.com", headers, "");
  expect(result).toBe('curl "https://api.example.com" -H "Content-Type: application/json" -H "Authorization: Bearer token"');
});

Deno.test("buildCurlCommand formats empty URL as empty quotes", () => {
  const result = buildCurlCommand("GET", "", [], "");
  expect(result).toBe('curl ""');
});
