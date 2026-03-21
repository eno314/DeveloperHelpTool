import {
  addUrlParam,
  createUrlText,
  parseUrl,
  removeUrlParamOf,
  updateUrlParams,
  type UrlParam,
} from "../../../utils/urlParseUtils.ts";

// State
let parsedUrlText = "";
let baseUrlText = "";
let urlParams: UrlParam[] = [];

// DOM Elements
const parsedUrlInput = document.getElementById("parsedUrl") as HTMLInputElement;
const baseUrlInput = document.getElementById("baseUrl") as HTMLInputElement;
const parseUrlBtn = document.getElementById("parseUrlBtn") as HTMLButtonElement;
const buildUrlBtn = document.getElementById("buildUrlBtn") as HTMLButtonElement;
const urlParamsTableBody = document.getElementById(
  "urlParamsTableBody",
) as HTMLTableSectionElement;
const addParamBtn = document.getElementById("addParamBtn") as HTMLButtonElement;

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
      urlParams = updateUrlParams(
        urlParams,
        i,
        "key",
        (e.target as HTMLInputElement).value,
      );
    });
    tdKey.appendChild(inputKey);

    // Value Input
    const tdValue = document.createElement("td");
    const inputValue = document.createElement("input");
    inputValue.type = "text";
    inputValue.className = "form-control";
    inputValue.value = param.value;
    inputValue.addEventListener("input", (e) => {
      urlParams = updateUrlParams(
        urlParams,
        i,
        "value",
        (e.target as HTMLInputElement).value,
      );
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
  parsedUrlText = (e.target as HTMLInputElement).value;
});

baseUrlInput.addEventListener("input", (e) => {
  baseUrlText = (e.target as HTMLInputElement).value;
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
