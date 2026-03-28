export type Header = { key: string; value: string };

export const COMMON_CONTENT_TYPES = [
  "application/json",
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain",
  "text/html",
  "application/xml",
];

export function buildCurlCommand(
  method: string,
  url: string,
  headers: Header[],
  body: string,
): string {
  let cmd = "curl";

  // Strict allowlist for HTTP methods
  const allowedMethods = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
    "HEAD",
    "TRACE",
  ];
  const safeMethod = allowedMethods.includes(method.toUpperCase())
    ? method.toUpperCase()
    : "GET";

  if (safeMethod !== "GET") {
    cmd += ` -X ${safeMethod}`;
  }

  // Escape single quotes for shell safety
  const escapeShellArg = (arg: string) => `'${arg.replace(/'/g, "'\\''")}'`;

  if (url) {
    cmd += ` ${escapeShellArg(url)}`;
  } else {
    cmd += " ''";
  }

  for (const h of headers) {
    if (h.key || h.value) {
      cmd += ` -H ${escapeShellArg(`${h.key}: ${h.value}`)}`;
    }
  }

  if (["POST", "PUT", "PATCH"].includes(safeMethod) && body) {
    cmd += ` -d ${escapeShellArg(body)}`;
  }

  return cmd;
}
