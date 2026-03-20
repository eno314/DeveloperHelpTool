// Logic from urlParseUtils.ts (Inline for SPA prototype)

const parseUrl = (url) => {
  try {
    const parsedUrl = new URL(url);

    const urlParams = [];
    parsedUrl.searchParams.forEach((value, key) => {
      urlParams.push({ key, value });
    });

    return {
      baseUrlText: `${parsedUrl.protocol}//${parsedUrl.hostname}${parsedUrl.pathname}`,
      urlParams,
    };
  } catch (_e) {
    return { baseUrlText: "", urlParams: [] };
  }
};

const createUrlText = (baseUrlText, urlParams) => {
  const params = urlParams
    .filter((urlParam) => urlParam.key.length > 0 && urlParam.value)
    .map((urlParam) => {
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

const updateUrlParams = (base, index, type, value) => {
  const urlParams = Array.from(base);
  urlParams[index][type] = value;
  return urlParams;
};

const removeUrlParamOf = (index, urlParams) => {
  const newUrlParams = Array.from(urlParams);
  newUrlParams.splice(index, 1);
  return newUrlParams;
};

const addUrlParam = (urlParams) => {
  const newUrlParams = Array.from(urlParams);
  newUrlParams.push({ key: "", value: "" });
  return newUrlParams;
};

// State
let parsedUrlText = "";
let baseUrlText = "";
let urlParams = [];

// DOM Elements
const parsedUrlInput = document.getElementById("parsedUrl");
const baseUrlInput = document.getElementById("baseUrl");
const parseUrlBtn = document.getElementById("parseUrlBtn");
const buildUrlBtn = document.getElementById("buildUrlBtn");
const urlParamsTableBody = document.getElementById("urlParamsTableBody");
const addParamBtn = document.getElementById("addParamBtn");

// Render Functions
const render = () => {
  parsedUrlInput.value = parsedUrlText;
  baseUrlInput.value = baseUrlText;

  // Render table rows
  urlParamsTableBody.innerHTML = "";
  urlParams.forEach((param, i) => {
    const tr = document.createElement("tr");

    // Key Input
    const tdKey = document.createElement("td");
    const inputKey = document.createElement("input");
    inputKey.type = "text";
    inputKey.className = "form-control";
    inputKey.value = param.key;
    inputKey.addEventListener("input", (e) => {
      urlParams = updateUrlParams(urlParams, i, "key", e.target.value);
    });
    tdKey.appendChild(inputKey);

    // Value Input
    const tdValue = document.createElement("td");
    const inputValue = document.createElement("input");
    inputValue.type = "text";
    inputValue.className = "form-control";
    inputValue.value = param.value;
    inputValue.addEventListener("input", (e) => {
      urlParams = updateUrlParams(urlParams, i, "value", e.target.value);
    });
    tdValue.appendChild(inputValue);

    // Delete Button
    const tdDelete = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn-secondary btn-sm";
    deleteBtn.textContent = "delete";
    deleteBtn.addEventListener("click", () => {
      urlParams = removeUrlParamOf(i, urlParams);
      render(); // re-render needed after delete
    });
    tdDelete.appendChild(deleteBtn);

    tr.appendChild(tdKey);
    tr.appendChild(tdValue);
    tr.appendChild(tdDelete);

    urlParamsTableBody.appendChild(tr);
  });
};

// Event Listeners
parsedUrlInput.addEventListener("input", (e) => {
  parsedUrlText = e.target.value;
});

baseUrlInput.addEventListener("input", (e) => {
  baseUrlText = e.target.value;
});

parseUrlBtn.addEventListener("click", () => {
  const result = parseUrl(parsedUrlText);
  baseUrlText = result.baseUrlText;
  urlParams = result.urlParams;
  render();
});

buildUrlBtn.addEventListener("click", () => {
  parsedUrlText = createUrlText(baseUrlText, urlParams);
  render();
});

addParamBtn.addEventListener("click", () => {
  urlParams = addUrlParam(urlParams);
  render();
});

// Initial render
render();
