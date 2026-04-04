export type EncodeDecodeMode = "URL" | "Base64" | "JSON";

export const toEncodedText = (text: string, mode: EncodeDecodeMode): string => {
  return getEncodeDecodeHandler(mode).toEncodedText(text);
};

export const toDecodedText = (text: string, mode: EncodeDecodeMode): string => {
  return getEncodeDecodeHandler(mode).toDecodedText(text);
};

type encodeDecodeHandler = {
  toEncodedText: (text: string) => string;
  toDecodedText: (text: string) => string;
};

const getEncodeDecodeHandler = (
  mode: EncodeDecodeMode,
): encodeDecodeHandler => {
  switch (mode) {
    case "URL":
      return urlHandler;
    case "JSON":
      return jsonHandler;
    case "Base64":
      return base64Handler;
  }
};

const handleEncodeDecodeError = (
  err: unknown,
  action: "encode" | "decode",
): string => {
  const errMessage: string = (err as Error).toString();
  return `can not ${action}. ${errMessage}.`;
};

const urlHandler: encodeDecodeHandler = {
  toEncodedText: (text: string) => encodeURIComponent(text),
  toDecodedText: (text: string) => {
    try {
      return decodeURIComponent(text);
    } catch (err) {
      return handleEncodeDecodeError(err, "decode");
    }
  },
};

const jsonHandler: encodeDecodeHandler = {
  toEncodedText: (text: string) => {
    try {
      const obj = JSON.parse(text);
      return JSON.stringify(obj);
    } catch (err) {
      return handleEncodeDecodeError(err, "encode");
    }
  },
  toDecodedText: (text: string) => {
    try {
      const obj = JSON.parse(text);
      return JSON.stringify(obj, null, 2);
    } catch (err) {
      return handleEncodeDecodeError(err, "decode");
    }
  },
};

const base64Handler: encodeDecodeHandler = {
  toEncodedText: (text: string) => {
    try {
      const bytes = new TextEncoder().encode(text);
      const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte))
        .join("");
      return btoa(binString);
    } catch (err) {
      return handleEncodeDecodeError(err, "encode");
    }
  },
  toDecodedText: (text: string) => {
    try {
      const binString = atob(text);
      const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
      return new TextDecoder().decode(bytes);
    } catch (err) {
      return handleEncodeDecodeError(err, "decode");
    }
  },
};

export const getShowUploadContainers = (mode: EncodeDecodeMode): boolean => {
  return mode === "JSON";
};

export const getEncodingLabelText = (mode: EncodeDecodeMode): string => {
  return mode === "Base64"
    ? "Please input text you'd like to encode. (UTF-8)"
    : "Please input text you'd like to encode.";
};

export const getEncodingPlaceholderText = (mode: EncodeDecodeMode): string => {
  return mode === "Base64" ? "UTF-8" : "";
};
