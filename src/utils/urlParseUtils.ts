export interface UrlParam {
  key: string;
  value: string;
}

export const updateUrlParams = (
  base: UrlParam[],
  index: number,
  type: "key" | "value",
  value: string,
): UrlParam[] => {
  const urlParams = Array.from(base);
  urlParams[index][type] = value;
  return urlParams;
};

export const parseUrl = (
  url: string,
): { baseUrlText: string; urlParams: UrlParam[] } => {
  try {
    const parsedUrl = new URL(url);

    const urlParams: UrlParam[] = [];
    parsedUrl.searchParams.forEach((value: string, key: string) => {
      urlParams.push({ key, value });
    });

    return {
      baseUrlText:
        `${parsedUrl.protocol}//${parsedUrl.hostname}${parsedUrl.pathname}`,
      urlParams,
    };
  } catch (_e) {
    return { baseUrlText: "", urlParams: [] };
  }
};

export const createUrlText = (
  baseUrlText: string,
  urlParams: UrlParam[],
): string => {
  const params = urlParams
    .filter((urlParam: UrlParam) => urlParam.key.length > 0 && urlParam.value)
    .map((urlParam: UrlParam) => {
      const encodedValue = encodeURIComponent(urlParam.value);
      return `${urlParam.key}=${encodedValue}`;
    })
    .join("&");

  if (params.length === 0) {
    return baseUrlText;
  } else {
    return `${baseUrlText}?${params}`;
  }
};

export const removeUrlParamOf = (
  index: number,
  urlParams: UrlParam[],
): UrlParam[] => {
  const newUrlParams = Array.from(urlParams);
  newUrlParams.splice(index, 1);
  return newUrlParams;
};

export const addUrlParam = (urlParams: UrlParam[]): UrlParam[] => {
  const newUrlParams = Array.from(urlParams);
  newUrlParams.push({ key: "", value: "" });
  return newUrlParams;
};
