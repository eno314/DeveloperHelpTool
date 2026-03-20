export type EncodeDecodeMode = "URL" | "Base64" | "JSON";

export const toEncodedText = (text: string, mode: EncodeDecodeMode): string => {
  if (mode === "URL") {
    return encodeURIComponent(text);
  } else if (mode === "JSON") {
    try {
      const obj = JSON.parse(text);
      return JSON.stringify(obj);
    } catch (err) {
      const errMessage: string = (err as Error).toString();
      return `can not encode. ${errMessage}.`;
    }
  } else {
    try {
      const bytes = new TextEncoder().encode(text);
      const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte))
        .join("");
      return btoa(binString);
    } catch (err) {
      const errMessage: string = (err as Error).toString();
      return `can not encode. ${errMessage}.`;
    }
  }
};

export const toDecodedText = (text: string, mode: EncodeDecodeMode): string => {
  if (mode === "URL") {
    try {
      return decodeURIComponent(text);
    } catch (err) {
      const errMessage: string = (err as Error).toString();
      return `can not decode. ${errMessage}.`;
    }
  } else if (mode === "JSON") {
    try {
      const obj = JSON.parse(text);
      return JSON.stringify(obj, null, 2);
    } catch (err) {
      const errMessage: string = (err as Error).toString();
      return `can not decode. ${errMessage}.`;
    }
  } else {
    try {
      const binString = atob(text);
      const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
      return new TextDecoder().decode(bytes);
    } catch (err) {
      const errMessage: string = (err as Error).toString();
      return `can not decode. ${errMessage}.`;
    }
  }
};
