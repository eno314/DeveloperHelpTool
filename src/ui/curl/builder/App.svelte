<script lang="ts">
  import Layout from "../../Layout.svelte";
  import { buildCurlCommand, type Header } from "../../../domain/curlBuilder.ts";

  let method = $state("GET");
  let url = $state("");
  let headers = $state<Header[]>([]);
  let body = $state("");
  let copyBtnText = $state("Copy");
  let copyBtnClass = $state("btn-primary");

  let curlCommand = $derived(buildCurlCommand(method, url, headers, body));
  let showBody = $derived(["POST", "PUT", "PATCH"].includes(method));

  function addHeader() {
    headers.push({ key: "", value: "" });
  }

  function removeHeader(index: number) {
    headers.splice(index, 1);
  }

  function handleCopy() {
    void navigator.clipboard.writeText(curlCommand).then(() => {
      copyBtnText = "Copied!";
      copyBtnClass = "btn-success";
      setTimeout(() => {
        copyBtnText = "Copy";
        copyBtnClass = "btn-primary";
      }, 2000);
    });
  }
</script>

<Layout title="Developer Help Tool - Curl Builder Tool" description="You can build curl command by this tool.">
<div class="container mt-4">
  <div class="row mb-3">
    <div class="col-md-2">
      <label for="methodSelect" class="form-label">Method</label>
      <select id="methodSelect" class="form-select" bind:value={method}>
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
        <option value="PATCH">PATCH</option>
      </select>
    </div>
    <div class="col-md-10">
      <label for="urlInput" class="form-label">URL</label>
      <input
        id="urlInput"
        type="text"
        class="form-control"
        placeholder="https://example.com/api?query=1"
        bind:value={url}
      />
    </div>
  </div>

  <div class="row mb-3">
    <div class="col-12">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <label class="form-label mb-0">Headers</label>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          id="addHeaderBtn"
          onclick={addHeader}
        >
          + Add Header
        </button>
      </div>

      <div id="headersContainer">
        {#each headers as header, index}
          <div class="row mb-2">
            <div class="col-md-5">
              <input
                type="text"
                class="form-control header-key"
                placeholder="Key (e.g., Content-Type)"
                bind:value={header.key}
              />
            </div>
            <div class="col-md-6">
              <input
                type="text"
                class="form-control header-val"
                placeholder="Value (e.g., application/json)"
                bind:value={header.value}
              />
            </div>
            <div class="col-md-1 d-flex align-items-center">
              <button
                type="button"
                class="btn btn-sm btn-danger w-100 remove-header-btn"
                aria-label="Remove header"
                onclick={() => removeHeader(index)}
              >
                X
              </button>
            </div>
          </div>
        {/each}
      </div>

      {#if headers.length === 0}
        <div id="noHeadersMsg" class="text-muted small mb-2">
          No headers added.
        </div>
      {/if}
    </div>
  </div>

  {#if showBody}
    <div id="bodySection" class="row mb-3 form-floating">
      <textarea
        id="bodyTextarea"
        class="form-control"
        style="height: 150px"
        placeholder="Request Body"
        bind:value={body}
      ></textarea>
      <label for="bodyTextarea" style="left: 12px">Body</label>
    </div>
  {/if}

  <div class="row mb-3 mt-4">
    <div class="col-12">
      <label class="form-label fw-bold">Generated curl Command</label>
      <div class="position-relative">
        <textarea
          id="curlOutput"
          class="form-control bg-light"
          style="height: 120px; font-family: monospace"
          readonly
          value={curlCommand}
        ></textarea>
        <button
          type="button"
          id="copyBtn"
          class="btn btn-sm {copyBtnClass} position-absolute top-0 end-0 m-2"
          onclick={handleCopy}
        >
          {copyBtnText}
        </button>
      </div>
    </div>
  </div>
</div>
</Layout>
