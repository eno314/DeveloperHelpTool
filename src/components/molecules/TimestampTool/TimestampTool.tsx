'use client';

import React, {useState, useEffect} from 'react';

const TimestampTool = (): React.JSX.Element => {
  const [now, setNow] = useState<Date | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState<string>('');

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
    setNow(new Date()); // Initial set to avoid hydration mismatch if not using SSR date, but since it's 'use client' we still need to set it on mount.
    const interval = setInterval(() => {
      setNow(new Date());
    }, 100); // 100ms for responsiveness

    return () => clearInterval(interval);
  }, []);

  const handleCopy = (textToCopy: string, id: string) => {
    void navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

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

  // Wait for client to render
  if (!now) {
    return <div className="container mt-4">Loading...</div>;
  }

  const timestamp = Math.floor(now.getTime() / 1000);

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
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
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
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
      </div>
    </div>
  );
};

export default TimestampTool;
