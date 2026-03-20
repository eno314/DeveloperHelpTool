'use client';

import React, {useState, useEffect} from 'react';

const TimestampTool = (): React.JSX.Element => {
  const [now, setNow] = useState<Date | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setNow(new Date()); // Initial set to avoid hydration mismatch if not using SSR date, but since it's 'use client' we still need to set it on mount.
    const interval = setInterval(() => {
      setNow(new Date());
    }, 100); // 100ms for responsiveness

    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    if (!now) return;
    const timestamp = Math.floor(now.getTime() / 1000).toString();
    void navigator.clipboard.writeText(timestamp).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
                className={`btn ${copied ? 'btn-success' : 'btn-outline-primary'}`}
                onClick={handleCopy}
                aria-label="Copy timestamp"
              >
                {copied ? 'Copied!' : 'Copy'}
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
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Japan (JST)</td>
                    <td className="text-monospace">
                      {formatDate(now, 'Asia/Tokyo')}
                    </td>
                  </tr>
                  <tr>
                    <td>UTC (GMT)</td>
                    <td className="text-monospace">{formatDate(now, 'UTC')}</td>
                  </tr>
                  <tr>
                    <td>New York (EST/EDT)</td>
                    <td className="text-monospace">
                      {formatDate(now, 'America/New_York')}
                    </td>
                  </tr>
                  <tr>
                    <td>London (GMT/BST)</td>
                    <td className="text-monospace">
                      {formatDate(now, 'Europe/London')}
                    </td>
                  </tr>
                  <tr>
                    <td>Local Time</td>
                    <td className="text-monospace">
                      {formatDate(
                        now,
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
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
