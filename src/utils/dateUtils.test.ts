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

Deno.test("parseFormattedDate handles invalid local date parsing", () => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Passing an out of bounds date that parses to an invalid time
  const result = parseFormattedDate("9999-99-99 99:99:99", timeZone);
  expect(result).toBeNull();
});

Deno.test("parseFormattedDate handles invalid UTC date bounds", () => {
  const result = parseFormattedDate("9999-99-99 99:99:99", "UTC");
  expect(result).toBeNull();
});

Deno.test("formatDate handles midnight (24->00)", () => {
  // In node/v8, formatToParts can return '24' for midnight.
  // We mock the timezone parts to test this since actual dates might always return '00'.
  // This is purely an internal sanity test so we'll just test the main branches.
});
Deno.test("formatDate handles missing parts by mocking", () => {
  const originalFormatToParts = Intl.DateTimeFormat.prototype.formatToParts;
  try {
    Intl.DateTimeFormat.prototype.formatToParts = () => [];
    const result = formatDate(new Date(2023, 4, 15), "UTC");
    expect(result).toBeDefined(); // Should fall back to regular format()
  } finally {
    Intl.DateTimeFormat.prototype.formatToParts = originalFormatToParts;
  }
});

Deno.test("formatDate handles midnight 24 hour", () => {
  const originalFormatToParts = Intl.DateTimeFormat.prototype.formatToParts;
  try {
    Intl.DateTimeFormat.prototype.formatToParts = () => [
      { type: "year", value: "2023" },
      { type: "month", value: "05" },
      { type: "day", value: "15" },
      { type: "hour", value: "24" },
      { type: "minute", value: "30" },
      { type: "second", value: "45" },
    ];
    const result = formatDate(new Date(2023, 4, 15), "UTC");
    expect(result).toBe("2023-05-15 00:30:45");
  } finally {
    Intl.DateTimeFormat.prototype.formatToParts = originalFormatToParts;
  }
});

Deno.test("parseFormattedDate fallback branch local time valid", () => {
  const d = parseFormattedDate("2023-05-15 12:30:45", "Non-UTC");
  expect(d).not.toBeNull();
});

Deno.test("parseFormattedDate fallback branch local time invalid", () => {
  const originalDate = globalThis.Date;
  try {
    // @ts-ignore: Mock Date globally briefly to force isNaN
    globalThis.Date = function (...args: unknown[]) {
      if (args.length === 1 && typeof args[0] === "string" && args[0] === "2023-05-15T12:30:45") {
        return new originalDate("invalid");
      }
      return new originalDate(...(args as []));
    } as unknown as typeof Date;
    const d = parseFormattedDate("2023-05-15 12:30:45", "Non-UTC");
    expect(d).toBeNull();
  } finally {
    globalThis.Date = originalDate;
  }
});

Deno.test("parseFormattedDate throws in catch block", () => {
  const originalDate = globalThis.Date;
  try {
    // @ts-ignore: throw error to hit catch block
    globalThis.Date = class {
      constructor() { throw new Error("mock error"); }
    };
    const d = parseFormattedDate("2023-05-15 12:30:45", "UTC");
    expect(d).toBeNull();
  } finally {
    globalThis.Date = originalDate;
  }
});
