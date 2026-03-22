<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { formatDate, parseFormattedDate } from "../../utils/dateUtils.ts";

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

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  let currentTimestamp = $state("");
  let localTimeVal = $state("");
  let utcTimeVal = $state("");

  let selectedTimezone = $state("");
  let selectedTimeVal = $state("");

  let converterTimestamp = $state("");
  let converterLocalTime = $state("");
  let converterUtcTime = $state("");

  let intervalId: number;

  const handleCopy = (textToCopy: string, event: MouseEvent) => {
    const btnElement = event.currentTarget as HTMLElement;
    void navigator.clipboard.writeText(textToCopy).then(() => {
      const originalText = btnElement.textContent;
      const originalClass = btnElement.className;

      btnElement.textContent = "Copied!";
      btnElement.className =
        "btn btn-success" + (originalClass.includes("btn-sm") ? " btn-sm" : "");

      setTimeout(() => {
        btnElement.textContent = originalText;
        btnElement.className = originalClass;
      }, 2000);
    });
  };

  function updateCurrentTime() {
    const now = new Date();
    const ts = Math.floor(now.getTime() / 1000);
    currentTimestamp = ts.toString();

    localTimeVal = formatDate(now, localTimeZone);
    utcTimeVal = formatDate(now, "UTC");

    if (selectedTimezone) {
      selectedTimeVal = formatDate(now, selectedTimezone);
    } else {
      selectedTimeVal = "";
    }
  }

  onMount(() => {
    const initDate = new Date();
    converterTimestamp = Math.floor(initDate.getTime() / 1000).toString();
    converterLocalTime = formatDate(initDate, localTimeZone);
    converterUtcTime = formatDate(initDate, "UTC");

    updateCurrentTime();
    intervalId = setInterval(updateCurrentTime, 100);
  });

  onDestroy(() => {
    if (intervalId !== undefined) {
      clearInterval(intervalId);
    }
  });

  function onConverterTimestampInput(e: Event) {
    const newTs = (e.target as HTMLInputElement).value;
    converterTimestamp = newTs;
    const parsedTs = parseInt(newTs, 10);
    if (!isNaN(parsedTs)) {
      const date = new Date(parsedTs * 1000);
      converterLocalTime = formatDate(date, localTimeZone);
      converterUtcTime = formatDate(date, "UTC");
    }
  }

  function onConverterLocalTimeInput(e: Event) {
    const newLocalTime = (e.target as HTMLInputElement).value;
    converterLocalTime = newLocalTime;
    const date = parseFormattedDate(newLocalTime, localTimeZone);
    if (date) {
      converterTimestamp = Math.floor(date.getTime() / 1000).toString();
      converterUtcTime = formatDate(date, "UTC");
    }
  }

  function onConverterUtcTimeInput(e: Event) {
    const newUtcTime = (e.target as HTMLInputElement).value;
    converterUtcTime = newUtcTime;
    const date = parseFormattedDate(newUtcTime, "UTC");
    if (date) {
      converterTimestamp = Math.floor(date.getTime() / 1000).toString();
      converterLocalTime = formatDate(date, localTimeZone);
    }
  }
</script>

<div class="container mt-4">
  <div class="row">
    <div class="col-12 col-md-6 mb-4 mb-md-0">
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">Current Unix Timestamp (Seconds)</h5>
        </div>
        <div class="card-body d-flex align-items-center justify-content-between">
          <h2 class="mb-0 text-monospace" id="currentTimestamp">{currentTimestamp}</h2>
          <button
            type="button"
            class="btn btn-outline-primary"
            aria-label="Copy timestamp"
            onclick={(e) => handleCopy(currentTimestamp, e)}
          >
            Copy
          </button>
        </div>
      </div>

      <div class="card h-100">
        <div class="card-header bg-secondary text-white">
          <h5 class="mb-0">Current Time</h5>
        </div>
        <div class="card-body">
          <table class="table table-striped table-hover mb-0">
            <thead>
              <tr>
                <th scope="col">Timezone / City</th>
                <th scope="col">Time (YYYY-MM-DD HH:mm:ss)</th>
                <th scope="col" style="width: 100px">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="align-middle">Local Time</td>
                <td class="text-monospace align-middle">{localTimeVal}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-primary"
                    aria-label="Copy time for Local Time"
                    onclick={(e) => handleCopy(localTimeVal, e)}
                  >
                    Copy
                  </button>
                </td>
              </tr>
              <tr>
                <td class="align-middle">UTC (GMT)</td>
                <td class="text-monospace align-middle">{utcTimeVal}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-primary"
                    aria-label="Copy time for UTC (GMT)"
                    onclick={(e) => handleCopy(utcTimeVal, e)}
                  >
                    Copy
                  </button>
                </td>
              </tr>
              <tr>
                <td class="align-middle">
                  <select
                    class="form-select form-select-sm"
                    aria-label="Select timezone"
                    bind:value={selectedTimezone}
                  >
                    <option value="">Select a Timezone...</option>
                    {#each TIMEZONE_GROUPS as group}
                      <optgroup label={group.group}>
                        {#each group.options as tz}
                          <option value={tz.value}>{tz.label}</option>
                        {/each}
                      </optgroup>
                    {/each}
                  </select>
                </td>
                <td class="text-monospace align-middle">{selectedTimeVal}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-primary {selectedTimezone ? '' : 'd-none'}"
                    aria-label="Copy time for selected timezone"
                    onclick={(e) => handleCopy(selectedTimeVal, e)}
                  >
                    Copy
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-6">
      <div class="card h-100">
        <div class="card-header bg-secondary text-white">
          <h5 class="mb-0">Timestamp Converter</h5>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label for="converterTimestamp" class="form-label fw-bold">
              Unix Timestamp (Seconds)
            </label>
            <div class="input-group">
              <input
                type="number"
                class="form-control text-monospace"
                id="converterTimestamp"
                value={converterTimestamp}
                oninput={onConverterTimestampInput}
              />
              <button
                type="button"
                class="btn btn-outline-secondary"
                aria-label="Copy converter timestamp"
                onclick={(e) => handleCopy(converterTimestamp, e)}
              >
                Copy
              </button>
            </div>
          </div>

          <div class="mb-3">
            <label for="converterLocalTime" class="form-label fw-bold">
              Local Time (YYYY-MM-DD HH:mm:ss)
            </label>
            <div class="input-group">
              <input
                type="text"
                class="form-control text-monospace"
                id="converterLocalTime"
                value={converterLocalTime}
                oninput={onConverterLocalTimeInput}
              />
              <button
                type="button"
                class="btn btn-outline-secondary"
                aria-label="Copy converter local time"
                onclick={(e) => handleCopy(converterLocalTime, e)}
              >
                Copy
              </button>
            </div>
          </div>

          <div class="mb-3">
            <label for="converterUtcTime" class="form-label fw-bold">
              UTC Time (YYYY-MM-DD HH:mm:ss)
            </label>
            <div class="input-group">
              <input
                type="text"
                class="form-control text-monospace"
                id="converterUtcTime"
                value={converterUtcTime}
                oninput={onConverterUtcTimeInput}
              />
              <button
                type="button"
                class="btn btn-outline-secondary"
                aria-label="Copy converter UTC time"
                onclick={(e) => handleCopy(converterUtcTime, e)}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .text-monospace {
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace;
  }
</style>
