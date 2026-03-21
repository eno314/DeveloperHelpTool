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

const urlHandler: encodeDecodeHandler = {
  toEncodedText: (text: string) => encodeURIComponent(text),
  toDecodedText: (text: string) => {
    try {
      return decodeURIComponent(text);
    } catch (err) {
      const errMessage: string = (err as Error).toString();
      return `can not decode. ${errMessage}.`;
    }
  },
};

const jsonHandler: encodeDecodeHandler = {
  toEncodedText: (text: string) => {
    try {
      const obj = JSON.parse(text);
      return JSON.stringify(obj);
    } catch (err) {
      const errMessage: string = (err as Error).toString();
      return `can not encode. ${errMessage}.`;
    }
  },
  toDecodedText: (text: string) => {
    try {
      const obj = JSON.parse(text);
      return JSON.stringify(obj, null, 2);
    } catch (err) {
      const errMessage: string = (err as Error).toString();
      return `can not decode. ${errMessage}.`;
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
      const errMessage: string = (err as Error).toString();
      return `can not encode. ${errMessage}.`;
    }
  },
  toDecodedText: (text: string) => {
    try {
      const binString = atob(text);
      const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
      return new TextDecoder().decode(bytes);
    } catch (err) {
      const errMessage: string = (err as Error).toString();
      return `can not decode. ${errMessage}.`;
    }
  },
};
