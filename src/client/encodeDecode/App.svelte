<script lang="ts">
  import {
    type EncodeDecodeMode as EncodingMode,
    getEncodingLabelText,
    getEncodingPlaceholderText,
    getShowUploadContainers,
    toDecodedText,
    toEncodedText,
  } from "../../domain/encodeDecode.ts";

  let mode = $state<EncodingMode>("URL");
  let encodingText = $state("");
  let decodingText = $state("");

  // Derived states based on mode
  let showUploadContainers = $derived(getShowUploadContainers(mode));
  let encodingLabelText = $derived(getEncodingLabelText(mode));
  let encodingPlaceholderText = $derived(getEncodingPlaceholderText(mode));

  function handleModeChange() {
    encodingText = "";
    decodingText = "";
  }

  function handleEncode() {
    decodingText = toEncodedText(encodingText, mode);
  }

  function handleDecode() {
    encodingText = toDecodedText(decodingText, mode);
  }

  function handleFileChange(side: "left" | "right") {
    return (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === "string") {
          if (side === "left") {
            encodingText = content;
          } else {
            decodingText = content;
          }
        }
      };
      reader.readAsText(file);
      target.value = "";
    };
  }
</script>

<style>
  .textarea {
    height: 500px !important;
  }
  .gap-3 {
    gap: 1rem !important;
  }
</style>

<div class="container mt-5">
  <h1>Developer Help Tool - Encode And Decode Tool</h1>

  <div id="root">
    <div class="container">
      <div class="row mb-3">
        <div class="col-md-4">
          <label for="modeSelect" class="form-label">Format</label>
          <select id="modeSelect" class="form-select" bind:value={mode} onchange={handleModeChange}>
            <option value="URL">URL</option>
            <option value="Base64">Base64</option>
            <option value="JSON">JSON</option>
          </select>
        </div>
      </div>

      <div class="row align-items-center mb-3">
        <div class="col-md-5">
          <div id="leftUploadContainer" class="mb-2" class:d-none={!showUploadContainers}>
            <label for="left-upload" class="form-label d-block mb-1">
              Upload File to Encode
            </label>
            <input
              id="left-upload"
              type="file"
              accept=".json,.txt"
              class="form-control form-control-sm"
              aria-label="Upload File to Encode"
              onchange={handleFileChange("left")}
            />
          </div>
          <div class="form-floating">
            <textarea
              id="encodingTextarea"
              class="form-control textarea"
              placeholder={encodingPlaceholderText}
              bind:value={encodingText}
            ></textarea>
            <label id="encodingTextareaLabel" for="encodingTextarea">
              {encodingLabelText}
            </label>
          </div>
        </div>

        <div class="col-md-2 text-center d-flex flex-column gap-3">
          <button type="button" class="btn btn-primary" id="encodeBtn" onclick={handleEncode}>
            Encoding ▶
          </button>
          <button type="button" class="btn btn-primary" id="decodeBtn" onclick={handleDecode}>
            ◀ Decoding
          </button>
        </div>

        <div class="col-md-5">
          <div id="rightUploadContainer" class="mb-2" class:d-none={!showUploadContainers}>
            <label for="right-upload" class="form-label d-block mb-1">
              Upload File to Decode
            </label>
            <input
              id="right-upload"
              type="file"
              accept=".json,.txt"
              class="form-control form-control-sm"
              aria-label="Upload File to Decode"
              onchange={handleFileChange("right")}
            />
          </div>
          <div class="form-floating">
            <textarea
              id="decodingTextarea"
              class="form-control textarea"
              placeholder="Please input text you'd like to decode."
              bind:value={decodingText}
            ></textarea>
            <label for="decodingTextarea">
              Please input text you'd like to decode.
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
