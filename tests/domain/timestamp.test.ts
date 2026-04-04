import { expect } from "@std/expect";
import {
  convertFromLocalTime,
  convertFromTimestamp,
  convertFromUtcTime,
  getCurrentTimeValues,
  TIMEZONE_GROUPS,
} from "../../src/domain/timestamp.ts";

Deno.test("timestamp domain ...", async (t) => {
  await t.step("TIMEZONE_GROUPS should be defined", () => {
    expect(TIMEZONE_GROUPS).toBeDefined();
    expect(TIMEZONE_GROUPS.length).toBeGreaterThan(0);
  });

  await t.step("getCurrentTimeValues", () => {
    // 2024-01-01T12:00:00Z -> 1704110400
    const mockNow = new Date("2024-01-01T12:00:00Z");
    const localTimeZone = "Asia/Tokyo"; // +9 hours => 2024-01-01 21:00:00
    const selectedTimezone = "America/New_York"; // -5 hours => 2024-01-01 07:00:00

    const result = getCurrentTimeValues(
      mockNow,
      localTimeZone,
      selectedTimezone,
    );

    expect(result.currentTimestamp).toBe("1704110400");
    expect(result.localTimeVal).toBe("2024-01-01 21:00:00");
    expect(result.utcTimeVal).toBe("2024-01-01 12:00:00");
    expect(result.selectedTimeVal).toBe("2024-01-01 07:00:00");
  });

  await t.step(
    "getCurrentTimeValues handles empty selectedTimezone gracefully",
    () => {
      const mockNow = new Date("2024-01-01T12:00:00Z");
      const localTimeZone = "UTC";

      const result = getCurrentTimeValues(mockNow, localTimeZone, "");

      expect(result.selectedTimeVal).toBe("");
    },
  );

  await t.step("convertFromTimestamp - valid input", () => {
    // 1704110400 -> 2024-01-01T12:00:00Z
    const result = convertFromTimestamp("1704110400", "Asia/Tokyo");
    expect(result).not.toBeNull();
    if (result) {
      expect(result.converterLocalTime).toBe("2024-01-01 21:00:00");
      expect(result.converterUtcTime).toBe("2024-01-01 12:00:00");
    }
  });

  await t.step("convertFromTimestamp - invalid input", () => {
    const result = convertFromTimestamp("invalid", "Asia/Tokyo");
    expect(result).toBeNull();
  });

  await t.step("convertFromLocalTime - valid input", () => {
    // Input is local time Tokyo: 2024-01-01 21:00:00 -> UTC: 2024-01-01 12:00:00 -> 1704110400
    // But note that `parseFormattedDate` with anything other than 'UTC' parses in the system's local time zone.
    // For reliable cross-environment testing of local time parsing here, let's test with UTC strings
    // to simulate the "local" behavior in UTC system environments, or test parsing a UTC string as "UTC" local.

    // Instead of forcing a timezone which Javascript Date doesn't easily mock, we test that formatting back works:
    // When local is UTC:
    const result = convertFromLocalTime("2024-01-01 12:00:00", "UTC");

    // Because parsing is dependent on system timezone if not "UTC", we only test the "UTC" path securely here.
    if (result) {
      // Assuming test runs in UTC, or since we passed 'UTC' it parses correctly as UTC inside parseFormattedDate
      // ACTUALLY: `parseFormattedDate(str, "UTC")` explicitly appends `Z`.
      // Let's test the "UTC" explicitly as local.
      const resultUTCAsLocal = convertFromLocalTime(
        "2024-01-01 12:00:00",
        "UTC",
      );
      expect(resultUTCAsLocal).not.toBeNull();
      expect(resultUTCAsLocal?.converterUtcTime).toBe("2024-01-01 12:00:00");
      expect(resultUTCAsLocal?.converterTimestamp).toBe("1704110400");
    }
  });

  await t.step("convertFromLocalTime - invalid input", () => {
    const result = convertFromLocalTime("invalid date string", "UTC");
    expect(result).toBeNull();
  });

  await t.step("convertFromUtcTime - valid input", () => {
    const result = convertFromUtcTime("2024-01-01 12:00:00", "Asia/Tokyo");
    expect(result).not.toBeNull();
    if (result) {
      expect(result.converterTimestamp).toBe("1704110400");
      expect(result.converterLocalTime).toBe("2024-01-01 21:00:00");
    }
  });

  await t.step("convertFromUtcTime - invalid input", () => {
    const result = convertFromUtcTime("invalid date string", "Asia/Tokyo");
    expect(result).toBeNull();
  });
});
