const TIMEZONE_GROUPS = [
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
      {
        label: "Buenos Aires (ART)",
        value: "America/Argentina/Buenos_Aires",
      },
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

function formatDate(date: Date, timeZone: string): string {
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

function parseFormattedDate(dateStr: string, timeZone: string): Date | null {
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

const handleCopy = (textToCopy: string, btnElement: HTMLElement) => {
  void navigator.clipboard.writeText(textToCopy).then(() => {
    const originalText = btnElement.textContent;
    const originalClass = btnElement.className;

    btnElement.textContent = "Copied!";
    btnElement.className = "btn btn-success" +
      (originalClass.includes("btn-sm") ? " btn-sm" : "");

    setTimeout(() => {
      btnElement.textContent = originalText;
      btnElement.className = originalClass;
    }, 2000);
  });
};

const currentTimestampEl = document.getElementById(
  "currentTimestamp",
) as HTMLHeadingElement;
const converterTimestampEl = document.getElementById(
  "converterTimestamp",
) as HTMLInputElement;
const converterLocalTimeEl = document.getElementById(
  "converterLocalTime",
) as HTMLInputElement;
const converterUtcTimeEl = document.getElementById(
  "converterUtcTime",
) as HTMLInputElement;
const timeTableBody = document.getElementById(
  "timeTableBody",
) as HTMLTableSectionElement;
const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let selectedTimezone = "";

function updateCurrentTime() {
  const now = new Date();
  const ts = Math.floor(now.getTime() / 1000);
  currentTimestampEl.textContent = ts.toString();

  let html = "";
  const localTimeStr = formatDate(now, localTimeZone);
  html += `
    <tr>
      <td class="align-middle">Local Time</td>
      <td class="text-monospace align-middle" id="localTimeVal">${localTimeStr}</td>
      <td>
        <button type="button" id="copyLocalTimeBtn" class="btn btn-sm btn-outline-primary" aria-label="Copy time for Local Time">Copy</button>
      </td>
    </tr>
  `;

  const utcTimeStr = formatDate(now, "UTC");
  html += `
    <tr>
      <td class="align-middle">UTC (GMT)</td>
      <td class="text-monospace align-middle" id="utcTimeVal">${utcTimeStr}</td>
      <td>
        <button type="button" id="copyUtcTimeBtn" class="btn btn-sm btn-outline-primary" aria-label="Copy time for UTC (GMT)">Copy</button>
      </td>
    </tr>
  `;

  let tzSelectOptions = '<option value="">Select a Timezone...</option>';
  TIMEZONE_GROUPS.forEach((group) => {
    tzSelectOptions += `<optgroup label="${group.group}">`;
    group.options.forEach((tz) => {
      const selected = selectedTimezone === tz.value ? "selected" : "";
      tzSelectOptions +=
        `<option value="${tz.value}" ${selected}>${tz.label}</option>`;
    });
    tzSelectOptions += `</optgroup>`;
  });

  const selectedTimeStr = selectedTimezone
    ? formatDate(now, selectedTimezone)
    : "";
  const copyBtnHtml = selectedTimezone
    ? `<button type="button" id="copySelectedTimeBtn" class="btn btn-sm btn-outline-primary" aria-label="Copy time for selected timezone">Copy</button>`
    : "";

  html += `
    <tr>
      <td class="align-middle">
        <select class="form-select form-select-sm" id="timezoneSelect" aria-label="Select timezone">
          ${tzSelectOptions}
        </select>
      </td>
      <td class="text-monospace align-middle" id="selectedTimeVal">${selectedTimeStr}</td>
      <td>${copyBtnHtml}</td>
    </tr>
  `;

  let isLocalCopied = false;
  let isUtcCopied = false;
  let isSelectedCopied = false;

  const oldLocalBtn = document.getElementById("copyLocalTimeBtn");
  if (oldLocalBtn) isLocalCopied = oldLocalBtn.textContent === "Copied!";

  const oldUtcBtn = document.getElementById("copyUtcTimeBtn");
  if (oldUtcBtn) isUtcCopied = oldUtcBtn.textContent === "Copied!";

  const oldSelectedBtn = document.getElementById("copySelectedTimeBtn");
  if (oldSelectedBtn) {
    isSelectedCopied = oldSelectedBtn.textContent === "Copied!";
  }

  timeTableBody.innerHTML = html;

  if (isLocalCopied) {
    const btn = document.getElementById("copyLocalTimeBtn");
    if (btn) {
      btn.textContent = "Copied!";
      btn.className = "btn btn-sm btn-success";
    }
  }
  if (isUtcCopied) {
    const btn = document.getElementById("copyUtcTimeBtn");
    if (btn) {
      btn.textContent = "Copied!";
      btn.className = "btn btn-sm btn-success";
    }
  }
  if (isSelectedCopied) {
    const btn = document.getElementById("copySelectedTimeBtn");
    if (btn) {
      btn.textContent = "Copied!";
      btn.className = "btn btn-sm btn-success";
    }
  }

  document
    .getElementById("timezoneSelect")
    ?.addEventListener("change", (e) => {
      selectedTimezone = (e.target as HTMLSelectElement).value;
      updateCurrentTime();
    });

  document.getElementById("copyLocalTimeBtn")?.addEventListener(
    "click",
    function () {
      handleCopy(document.getElementById("localTimeVal")!.textContent!, this);
    },
  );

  document.getElementById("copyUtcTimeBtn")?.addEventListener(
    "click",
    function () {
      handleCopy(document.getElementById("utcTimeVal")!.textContent!, this);
    },
  );

  document.getElementById("copySelectedTimeBtn")?.addEventListener(
    "click",
    function () {
      handleCopy(
        document.getElementById("selectedTimeVal")!.textContent!,
        this,
      );
    },
  );
}

document.getElementById("copyTimestampBtn")?.addEventListener(
  "click",
  function () {
    handleCopy(currentTimestampEl.textContent!, this);
  },
);

document.getElementById("copyConverterTimestampBtn")?.addEventListener(
  "click",
  function () {
    handleCopy(converterTimestampEl.value, this);
  },
);
document.getElementById("copyConverterLocalTimeBtn")?.addEventListener(
  "click",
  function () {
    handleCopy(converterLocalTimeEl.value, this);
  },
);
document.getElementById("copyConverterUtcTimeBtn")?.addEventListener(
  "click",
  function () {
    handleCopy(converterUtcTimeEl.value, this);
  },
);

const initDate = new Date();
converterTimestampEl.value = Math.floor(initDate.getTime() / 1000).toString();
converterLocalTimeEl.value = formatDate(initDate, localTimeZone);
converterUtcTimeEl.value = formatDate(initDate, "UTC");

converterTimestampEl.addEventListener("input", (e) => {
  const newTs = (e.target as HTMLInputElement).value;
  const parsedTs = parseInt(newTs, 10);
  if (!isNaN(parsedTs)) {
    const date = new Date(parsedTs * 1000);
    converterLocalTimeEl.value = formatDate(date, localTimeZone);
    converterUtcTimeEl.value = formatDate(date, "UTC");
  }
});

converterLocalTimeEl.addEventListener("input", (e) => {
  const newLocalTime = (e.target as HTMLInputElement).value;
  const date = parseFormattedDate(newLocalTime, localTimeZone);
  if (date) {
    converterTimestampEl.value = Math.floor(date.getTime() / 1000).toString();
    converterUtcTimeEl.value = formatDate(date, "UTC");
  }
});

converterUtcTimeEl.addEventListener("input", (e) => {
  const newUtcTime = (e.target as HTMLInputElement).value;
  const date = parseFormattedDate(newUtcTime, "UTC");
  if (date) {
    converterTimestampEl.value = Math.floor(date.getTime() / 1000).toString();
    converterLocalTimeEl.value = formatDate(date, localTimeZone);
  }
});

setInterval(updateCurrentTime, 100);
updateCurrentTime();
