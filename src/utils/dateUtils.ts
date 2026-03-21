export function formatDate(
  date: Date,
  timeZone: string,
  formatter?: Intl.DateTimeFormat,
): string {
  const dtFormatter = formatter || new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = dtFormatter.formatToParts(date);
  const yyyy = parts.find((p) => p.type === "year")?.value;
  const mm = parts.find((p) => p.type === "month")?.value;
  const dd = parts.find((p) => p.type === "day")?.value;
  const hh = parts.find((p) => p.type === "hour")?.value;
  const min = parts.find((p) => p.type === "minute")?.value;
  const ss = parts.find((p) => p.type === "second")?.value;

  if (!yyyy || !mm || !dd || !hh || !min || !ss) {
    return dtFormatter.format(date);
  }

  let formattedHh = hh;
  if (formattedHh === "24") {
    formattedHh = "00";
  }

  return `${yyyy}-${mm}-${dd} ${formattedHh}:${min}:${ss}`;
}

/**
 * Parses a date string in "YYYY-MM-DD HH:mm:ss" format.
 * Due to JavaScript's Date limitations, it only natively supports parsing
 * the given string as either UTC (if timeZone === "UTC") or the runtime's local timezone.
 * Arbitrary IANA timezones are ignored and treated as local time.
 * @param dateStr the date string to parse
 * @param timeZone "UTC" or any other string (treated as local)
 */
export function parseFormattedDate(
  dateStr: string,
  timeZone: string,
): Date | null {
  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  if (!regex.test(dateStr)) return null;

  try {
    const isoStr = dateStr.replace(" ", "T");
    if (timeZone === "UTC") {
      const date = new Date(`${isoStr}Z`);
      return isNaN(date.getTime()) ? null : date;
    } else {
      const date = new Date(isoStr);
      return isNaN(date.getTime()) ? null : date;
    }
  } catch {
    return null;
  }
}
