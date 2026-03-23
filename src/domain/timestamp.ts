import { formatDate, parseFormattedDate } from "../utils/dateUtils.ts";

export const TIMEZONE_GROUPS = [
  {
    group: "Africa",
    options: [
      { label: "Cairo (EET/EEST)", value: "Africa/Cairo" },
      { label: "Johannesburg (SAST)", value: "Africa/Johannesburg" },
      { label: "Nairobi (EAT)", value: "Africa/Nairobi" },
    ],
  },
  {
    group: "Americas",
    options: [
      { label: "Bogota (COT)", value: "America/Bogota" },
      { label: "Buenos Aires (ART)", value: "America/Argentina/Buenos_Aires" },
      { label: "Costa Rica (CST)", value: "America/Costa_Rica" },
      { label: "Los Angeles (PST/PDT)", value: "America/Los_Angeles" },
      { label: "Mexico City (CST/CDT)", value: "America/Mexico_City" },
      { label: "New York (EST/EDT)", value: "America/New_York" },
      { label: "Sao Paulo (BRT/BRST)", value: "America/Sao_Paulo" },
    ],
  },
  {
    group: "Asia",
    options: [
      { label: "Almaty (ALMT)", value: "Asia/Almaty" },
      { label: "Japan (JST)", value: "Asia/Tokyo" },
      { label: "Tashkent (UZT)", value: "Asia/Tashkent" },
    ],
  },
  {
    group: "Europe",
    options: [
      { label: "London (GMT/BST)", value: "Europe/London" },
      { label: "Paris (CET/CEST)", value: "Europe/Paris" },
    ],
  },
  {
    group: "Oceania",
    options: [{ label: "Sydney (AEST/AEDT)", value: "Australia/Sydney" }],
  },
];

export function getCurrentTimeValues(
  now: Date,
  localTimeZone: string,
  selectedTimezone: string,
): {
  currentTimestamp: string;
  localTimeVal: string;
  utcTimeVal: string;
  selectedTimeVal: string;
} {
  const ts = Math.floor(now.getTime() / 1000);
  const currentTimestamp = ts.toString();

  const localTimeVal = formatDate(now, localTimeZone);
  const utcTimeVal = formatDate(now, "UTC");

  let selectedTimeVal = "";
  if (selectedTimezone) {
    selectedTimeVal = formatDate(now, selectedTimezone);
  }

  return { currentTimestamp, localTimeVal, utcTimeVal, selectedTimeVal };
}

export function convertFromTimestamp(
  timestampStr: string,
  localTimeZone: string,
): { converterLocalTime: string; converterUtcTime: string } | null {
  const parsedTs = parseInt(timestampStr, 10);
  if (!isNaN(parsedTs)) {
    const date = new Date(parsedTs * 1000);
    return {
      converterLocalTime: formatDate(date, localTimeZone),
      converterUtcTime: formatDate(date, "UTC"),
    };
  }
  return null;
}

export function convertFromLocalTime(
  localTimeStr: string,
  localTimeZone: string,
): { converterTimestamp: string; converterUtcTime: string } | null {
  const date = parseFormattedDate(localTimeStr, localTimeZone);
  if (date) {
    return {
      converterTimestamp: Math.floor(date.getTime() / 1000).toString(),
      converterUtcTime: formatDate(date, "UTC"),
    };
  }
  return null;
}

export function convertFromUtcTime(
  utcTimeStr: string,
  localTimeZone: string,
): { converterTimestamp: string; converterLocalTime: string } | null {
  const date = parseFormattedDate(utcTimeStr, "UTC");
  if (date) {
    return {
      converterTimestamp: Math.floor(date.getTime() / 1000).toString(),
      converterLocalTime: formatDate(date, localTimeZone),
    };
  }
  return null;
}
