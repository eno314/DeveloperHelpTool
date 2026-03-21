const methodSelect = document.getElementById(
  "methodSelect",
) as HTMLSelectElement;
const urlInput = document.getElementById("urlInput") as HTMLInputElement;
const headersContainer = document.getElementById(
  "headersContainer",
) as HTMLDivElement;
const addHeaderBtn = document.getElementById(
  "addHeaderBtn",
) as HTMLButtonElement;
const noHeadersMsg = document.getElementById("noHeadersMsg") as HTMLDivElement;
const bodySection = document.getElementById("bodySection") as HTMLDivElement;
const bodyTextarea = document.getElementById(
  "bodyTextarea",
) as HTMLTextAreaElement;
const curlOutput = document.getElementById("curlOutput") as HTMLTextAreaElement;
const copyBtn = document.getElementById("copyBtn") as HTMLButtonElement;

type Header = { key: string; value: string };
const state = {
  method: "GET",
  url: "",
  headers: [] as Header[],
  body: "",
};

function renderHeaders() {
  headersContainer.innerHTML = "";
  if (state.headers.length === 0) {
    noHeadersMsg.classList.remove("d-none");
  } else {
    noHeadersMsg.classList.add("d-none");
    state.headers.forEach((header, index) => {
      const row = document.createElement("div");
      row.className = "row mb-2";
      row.innerHTML = `
        <div class="col-md-5">
          <input
            type="text"
            class="form-control header-key"
            placeholder="Key (e.g., Content-Type)"
            value="${header.key}"
            data-index="${index}"
          />
        </div>
        <div class="col-md-6">
          <input
            type="text"
            class="form-control header-val"
            placeholder="Value (e.g., application/json)"
            value="${header.value}"
            data-index="${index}"
          />
        </div>
        <div class="col-md-1 d-flex align-items-center">
          <button
            type="button"
            class="btn btn-sm btn-danger w-100 remove-header-btn"
            data-index="${index}"
            aria-label="Remove header"
          >
            X
          </button>
        </div>
      `;
      headersContainer.appendChild(row);
    });
  }
  updateCurlCommand();
}

function updateCurlCommand() {
  let cmd = "curl";

  if (state.method !== "GET") {
    cmd += ` -X ${state.method}`;
  }

  if (state.url) {
    cmd += ` "${state.url}"`;
  } else {
    cmd += ' ""';
  }

  for (const h of state.headers) {
    if (h.key || h.value) {
      cmd += ` -H "${h.key}: ${h.value}"`;
    }
  }

  if (["POST", "PUT", "PATCH"].includes(state.method) && state.body) {
    const escapedBody = state.body.replace(/'/g, "'\\''");
    cmd += ` -d '${escapedBody}'`;
  }

  curlOutput.value = cmd;
}

// Event Listeners
methodSelect.addEventListener("change", (e) => {
  state.method = (e.target as HTMLSelectElement).value;
  if (["POST", "PUT", "PATCH"].includes(state.method)) {
    bodySection.classList.remove("d-none");
  } else {
    bodySection.classList.add("d-none");
  }
  updateCurlCommand();
});

urlInput.addEventListener("input", (e) => {
  state.url = (e.target as HTMLInputElement).value;
  updateCurlCommand();
});

bodyTextarea.addEventListener("input", (e) => {
  state.body = (e.target as HTMLTextAreaElement).value;
  updateCurlCommand();
});

addHeaderBtn.addEventListener("click", () => {
  state.headers.push({ key: "", value: "" });
  renderHeaders();
});

headersContainer.addEventListener("input", (e) => {
  const target = e.target as HTMLInputElement;
  if (target.classList.contains("header-key")) {
    const idx = parseInt(target.dataset.index!, 10);
    state.headers[idx].key = target.value;
    updateCurlCommand();
  } else if (target.classList.contains("header-val")) {
    const idx = parseInt(target.dataset.index!, 10);
    state.headers[idx].value = target.value;
    updateCurlCommand();
  }
});

headersContainer.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains("remove-header-btn")) {
    const idx = parseInt(target.dataset.index!, 10);
    state.headers.splice(idx, 1);
    renderHeaders();
  }
});

copyBtn.addEventListener("click", () => {
  void navigator.clipboard.writeText(curlOutput.value).then(() => {
    copyBtn.textContent = "Copied!";
    copyBtn.classList.remove("btn-primary");
    copyBtn.classList.add("btn-success");
    setTimeout(() => {
      copyBtn.textContent = "Copy";
      copyBtn.classList.remove("btn-success");
      copyBtn.classList.add("btn-primary");
    }, 2000);
  });
});

// Initial render
renderHeaders();
updateCurlCommand();
