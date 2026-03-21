import { expect } from "@std/expect";
import { formatDate, parseFormattedDate } from "./dateUtils.ts";

Deno.test("formatDate formats UTC date correctly", () => {
  const d = new Date(Date.UTC(2023, 4, 15, 12, 30, 45));
  const formatted = formatDate(d, "UTC");
  expect(formatted).toBe("2023-05-15 12:30:45");
});

Deno.test("formatDate handles midnight (24->00)", () => {
  const d = new Date(Date.UTC(2023, 4, 15, 0, 30, 45));
  const formatted = formatDate(d, "UTC");
  expect(formatted).toBe("2023-05-15 00:30:45");
});

Deno.test("parseFormattedDate parses valid UTC string", () => {
  const dateStr = "2023-05-15 12:30:45";
  const d = parseFormattedDate(dateStr, "UTC");
  expect(d).not.toBeNull();
  expect(d!.getUTCFullYear()).toBe(2023);
  expect(d!.getUTCMonth()).toBe(4);
  expect(d!.getUTCDate()).toBe(15);
  expect(d!.getUTCHours()).toBe(12);
  expect(d!.getUTCMinutes()).toBe(30);
  expect(d!.getUTCSeconds()).toBe(45);
});

Deno.test("parseFormattedDate returns null for invalid format", () => {
  const d = parseFormattedDate("invalid date", "UTC");
  expect(d).toBeNull();
});

Deno.test("parseFormattedDate parses valid local string", () => {
  const dateStr = "2023-05-15 12:30:45";
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const d = parseFormattedDate(dateStr, timeZone);
  expect(d).not.toBeNull();
});
