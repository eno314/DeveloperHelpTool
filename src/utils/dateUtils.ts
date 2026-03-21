export function formatDate(date: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const yyyy = parts.find((p) => p.type === "year")?.value;
  const mm = parts.find((p) => p.type === "month")?.value;
  const dd = parts.find((p) => p.type === "day")?.value;
  const hh = parts.find((p) => p.type === "hour")?.value;
  const min = parts.find((p) => p.type === "minute")?.value;
  const ss = parts.find((p) => p.type === "second")?.value;

  if (!yyyy || !mm || !dd || !hh || !min || !ss) {
    return formatter.format(date);
  }

  let formattedHh = hh;
  if (formattedHh === "24") {
    formattedHh = "00";
  }

  return `${yyyy}-${mm}-${dd} ${formattedHh}:${min}:${ss}`;
}

export function parseFormattedDate(
  dateStr: string,
  timeZone: string,
): Date | null {
  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  if (!regex.test(dateStr)) return null;

  try {
    const isoStr = dateStr.replace(" ", "T");
    let fullStr = "";
    if (timeZone === "UTC") {
      fullStr = `${isoStr}Z`;
    } else {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return null;
      return d;
    }
    const date = new Date(fullStr);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}
