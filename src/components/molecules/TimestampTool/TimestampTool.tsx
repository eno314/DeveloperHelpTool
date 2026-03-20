'use client';

import React, {useState, useEffect} from 'react';

const TimestampTool = (): React.JSX.Element => {
  const [now, setNow] = useState<Date | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState<string>('');

  // Converter states
  const [converterTimestamp, setConverterTimestamp] = useState<string>('');
  const [converterLocalTime, setConverterLocalTime] = useState<string>('');
  const [converterUtcTime, setConverterUtcTime] = useState<string>('');

  const TIMEZONE_GROUPS = [
    {
      group: 'Africa',
      options: [
        {label: 'Cairo (EET/EEST)', value: 'Africa/Cairo'},
        {label: 'Johannesburg (SAST)', value: 'Africa/Johannesburg'},
        {label: 'Nairobi (EAT)', value: 'Africa/Nairobi'},
      ],
    },
    {
      group: 'Americas',
      options: [
        {label: 'Bogota (COT)', value: 'America/Bogota'},
        {label: 'Buenos Aires (ART)', value: 'America/Argentina/Buenos_Aires'},
        {label: 'Costa Rica (CST)', value: 'America/Costa_Rica'},
        {label: 'Los Angeles (PST/PDT)', value: 'America/Los_Angeles'},
        {label: 'Mexico City (CST/CDT)', value: 'America/Mexico_City'},
        {label: 'New York (EST/EDT)', value: 'America/New_York'},
        {label: 'Sao Paulo (BRT/BRST)', value: 'America/Sao_Paulo'},
      ],
    },
    {
      group: 'Asia',
      options: [
        {label: 'Almaty (ALMT)', value: 'Asia/Almaty'},
        {label: 'Japan (JST)', value: 'Asia/Tokyo'},
        {label: 'Tashkent (UZT)', value: 'Asia/Tashkent'},
      ],
    },
    {
      group: 'Europe',
      options: [
        {label: 'London (GMT/BST)', value: 'Europe/London'},
        {label: 'Paris (CET/CEST)', value: 'Europe/Paris'},
      ],
    },
    {
      group: 'Oceania',
      options: [{label: 'Sydney (AEST/AEDT)', value: 'Australia/Sydney'}],
    },
  ];

  useEffect(() => {
    const initialDate = new Date();
    setNow(initialDate); // Initial set to avoid hydration mismatch if not using SSR date, but since it's 'use client' we still need to set it on mount.

    // Initialize converter states with current time
    const initialTimestamp = Math.floor(
      initialDate.getTime() / 1000,
    ).toString();
    setConverterTimestamp(initialTimestamp);
    setConverterLocalTime(
      formatDate(initialDate, Intl.DateTimeFormat().resolvedOptions().timeZone),
    );
    setConverterUtcTime(formatDate(initialDate, 'UTC'));

    const interval = setInterval(() => {
      setNow(new Date());
    }, 100); // 100ms for responsiveness

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date, timeZone: string) => {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      // 'en-CA' gives YYYY-MM-DD
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    // The format from en-CA is "YYYY-MM-DD, HH:mm:ss" usually, we can adjust it
    const parts = formatter.formatToParts(date);
    const yyyy = parts.find(p => p.type === 'year')?.value;
    const mm = parts.find(p => p.type === 'month')?.value;
    const dd = parts.find(p => p.type === 'day')?.value;
    const hh = parts.find(p => p.type === 'hour')?.value;
    const min = parts.find(p => p.type === 'minute')?.value;
    const ss = parts.find(p => p.type === 'second')?.value;

    // Fallback if parts missing
    if (!yyyy || !mm || !dd || !hh || !min || !ss) {
      return formatter.format(date);
    }

    // To match exact YYYY-MM-DD HH:mm:ss (ignoring en-CA specifics)
    let formattedHh = hh;
    if (formattedHh === '24') {
      formattedHh = '00';
    }

    return `${yyyy}-${mm}-${dd} ${formattedHh}:${min}:${ss}`;
  };

  const handleCopy = (textToCopy: string, id: string) => {
    void navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTimestamp = e.target.value;
    setConverterTimestamp(newTimestamp);

    const parsedTimestamp = parseInt(newTimestamp, 10);
    if (!isNaN(parsedTimestamp)) {
      const date = new Date(parsedTimestamp * 1000);
      setConverterLocalTime(
        formatDate(date, Intl.DateTimeFormat().resolvedOptions().timeZone),
      );
      setConverterUtcTime(formatDate(date, 'UTC'));
    }
  };

  const parseFormattedDate = (
    dateStr: string,
    timeZone: string,
  ): Date | null => {
    // Basic regex validation for YYYY-MM-DD HH:mm:ss
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (!regex.test(dateStr)) {
      return null;
    }

    try {
      // Create date considering timezone
      // Replace space with T to make it ISO 8601-like, but we need to append timezone info
      const isoStr = dateStr.replace(' ', 'T');
      let fullStr = '';
      if (timeZone === 'UTC') {
        fullStr = `${isoStr}Z`;
      } else {
        // Construct date using local time
        const d = new Date(isoStr);
        if (isNaN(d.getTime())) {
          return null;
        }
        return d;
      }
      const date = new Date(fullStr);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  };

  const handleLocalTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocalTime = e.target.value;
    setConverterLocalTime(newLocalTime);

    const date = parseFormattedDate(
      newLocalTime,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
    if (date) {
      setConverterTimestamp(Math.floor(date.getTime() / 1000).toString());
      setConverterUtcTime(formatDate(date, 'UTC'));
    }
  };

  const handleUtcTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUtcTime = e.target.value;
    setConverterUtcTime(newUtcTime);

    const date = parseFormattedDate(newUtcTime, 'UTC');
    if (date) {
      setConverterTimestamp(Math.floor(date.getTime() / 1000).toString());
      setConverterLocalTime(
        formatDate(date, Intl.DateTimeFormat().resolvedOptions().timeZone),
      );
    }
  };

  // Wait for client to render
  if (!now) {
    return <div className="container mt-4">Loading...</div>;
  }

  const timestamp = Math.floor(now.getTime() / 1000);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12 col-md-6 mb-4 mb-md-0">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Current Unix Timestamp (Seconds)</h5>
            </div>
            <div className="card-body d-flex align-items-center justify-content-between">
              <h2 className="mb-0 text-monospace">{timestamp}</h2>
              <button
                className={`btn ${copiedId === 'timestamp' ? 'btn-success' : 'btn-outline-primary'}`}
                onClick={() => handleCopy(timestamp.toString(), 'timestamp')}
                aria-label="Copy timestamp"
              >
                {copiedId === 'timestamp' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="card h-100">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">Current Time</h5>
            </div>
            <div className="card-body">
              <table className="table table-striped table-hover mb-0">
                <thead>
                  <tr>
                    <th scope="col">Timezone / City</th>
                    <th scope="col">Time (YYYY-MM-DD HH:mm:ss)</th>
                    <th scope="col" style={{width: '100px'}}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: 'Local Time',
                      id: 'local',
                      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    },
                    {label: 'UTC (GMT)', id: 'utc', tz: 'UTC'},
                  ].map(row => {
                    const formattedTime = formatDate(now, row.tz);
                    return (
                      <tr key={row.id}>
                        <td className="align-middle">{row.label}</td>
                        <td className="text-monospace align-middle">
                          {formattedTime}
                        </td>
                        <td>
                          <button
                            className={`btn btn-sm ${copiedId === row.id ? 'btn-success' : 'btn-outline-primary'}`}
                            onClick={() => handleCopy(formattedTime, row.id)}
                            aria-label={`Copy time for ${row.label}`}
                          >
                            {copiedId === row.id ? 'Copied!' : 'Copy'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="align-middle">
                      <select
                        className="form-select form-select-sm"
                        value={selectedTimezone}
                        onChange={e => setSelectedTimezone(e.target.value)}
                        aria-label="Select timezone"
                      >
                        <option value="">Select a Timezone...</option>
                        {TIMEZONE_GROUPS.map(group => (
                          <optgroup key={group.group} label={group.group}>
                            {group.options.map(tz => (
                              <option key={tz.value} value={tz.value}>
                                {tz.label}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </td>
                    <td className="text-monospace align-middle">
                      {selectedTimezone
                        ? formatDate(now, selectedTimezone)
                        : ''}
                    </td>
                    <td>
                      {selectedTimezone && (
                        <button
                          className={`btn btn-sm ${copiedId === 'selected' ? 'btn-success' : 'btn-outline-primary'}`}
                          onClick={() =>
                            handleCopy(
                              formatDate(now, selectedTimezone),
                              'selected',
                            )
                          }
                          aria-label="Copy time for selected timezone"
                        >
                          {copiedId === 'selected' ? 'Copied!' : 'Copy'}
                        </button>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">Timestamp Converter</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label
                  htmlFor="converterTimestamp"
                  className="form-label fw-bold"
                >
                  Unix Timestamp (Seconds)
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control text-monospace"
                    id="converterTimestamp"
                    value={converterTimestamp}
                    onChange={handleTimestampChange}
                  />
                  <button
                    className={`btn ${copiedId === 'converter-timestamp' ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() =>
                      handleCopy(converterTimestamp, 'converter-timestamp')
                    }
                    aria-label="Copy converter timestamp"
                  >
                    {copiedId === 'converter-timestamp' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="converterLocalTime"
                  className="form-label fw-bold"
                >
                  Local Time (YYYY-MM-DD HH:mm:ss)
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control text-monospace"
                    id="converterLocalTime"
                    value={converterLocalTime}
                    onChange={handleLocalTimeChange}
                  />
                  <button
                    className={`btn ${copiedId === 'converter-local' ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() =>
                      handleCopy(converterLocalTime, 'converter-local')
                    }
                    aria-label="Copy converter local time"
                  >
                    {copiedId === 'converter-local' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="converterUtcTime"
                  className="form-label fw-bold"
                >
                  UTC Time (YYYY-MM-DD HH:mm:ss)
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control text-monospace"
                    id="converterUtcTime"
                    value={converterUtcTime}
                    onChange={handleUtcTimeChange}
                  />
                  <button
                    className={`btn ${copiedId === 'converter-utc' ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() =>
                      handleCopy(converterUtcTime, 'converter-utc')
                    }
                    aria-label="Copy converter UTC time"
                  >
                    {copiedId === 'converter-utc' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimestampTool;
