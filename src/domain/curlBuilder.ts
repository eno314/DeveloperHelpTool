export type Header = { key: string; value: string };

export function buildCurlCommand(
  method: string,
  url: string,
  headers: Header[],
  body: string,
): string {
  let cmd = "curl";

  if (method !== "GET") {
    cmd += ` -X ${method}`;
  }

  if (url) {
    cmd += ` "${url}"`;
  } else {
    cmd += ' ""';
  }

  for (const h of headers) {
    if (h.key || h.value) {
      cmd += ` -H "${h.key}: ${h.value}"`;
    }
  }

  if (["POST", "PUT", "PATCH"].includes(method) && body) {
    const escapedBody = body.replace(/'/g, "'\\''");
    cmd += ` -d '${escapedBody}'`;
  }

  return cmd;
}
