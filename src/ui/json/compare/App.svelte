<script lang="ts">
  import Layout from "../../Layout.svelte";
  import { compareJson } from "../../../domain/jsonCompare.ts";
  import type { Change as DiffResult } from "../../../utils/diff.ts";

  let leftJson = $state("");
  let rightJson = $state("");
  let errorMessage = $state("");
  let leftDifferences = $state<DiffResult[]>([]);
  let rightDifferences = $state<DiffResult[]>([]);
  let showResult = $state(false);

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
            leftJson = content;
          } else {
            rightJson = content;
          }
        }
      };
      reader.readAsText(file);
      target.value = "";
    };
  }

  function handleCompare() {
    errorMessage = "";
    showResult = false;
    leftDifferences = [];
    rightDifferences = [];

    const result = compareJson(leftJson, rightJson);

    errorMessage = result.errorMessage;
    leftDifferences = result.leftDifferences;
    rightDifferences = result.rightDifferences;

    if (!errorMessage) {
      showResult = true;
    }
  }
</script>

<style>
  .diffContainer {
    min-height: 200px;
    white-space: pre-wrap;
    word-break: break-all;
    background-color: #f8f9fa;
    padding: 1rem;
    border: 1px solid #ced4da;
    border-radius: 0.375rem;
  }
  .added {
    background-color: #d4edda;
    color: #155724;
  }
  .removed {
    background-color: #f8d7da;
    color: #721c24;
    text-decoration: line-through;
  }
</style>

<Layout title="Developer Help Tool - JSON Compare Tool" description="You can compare two JSONs by this tool.">
<div class="container mt-4">
  {#if errorMessage}
    <div id="errorAlert" class="alert alert-danger" role="alert">
      {errorMessage}
    </div>
  {/if}

  <div class="row mb-3">
    <div class="col-md-6">
      <div class="mb-2">
        <label for="left-json-input" class="form-label d-block mb-1">
          Left JSON
        </label>
        <input
          type="file"
          accept=".json"
          class="form-control form-control-sm"
          id="left-file-input"
          aria-label="Upload Left JSON file"
          onchange={handleFileChange("left")}
        />
      </div>
      <textarea
        id="left-json-input"
        class="form-control"
        rows="10"
        bind:value={leftJson}
      ></textarea>
    </div>
    <div class="col-md-6">
      <div class="mb-2">
        <label for="right-json-input" class="form-label d-block mb-1">
          Right JSON
        </label>
        <input
          type="file"
          accept=".json"
          class="form-control form-control-sm"
          id="right-file-input"
          aria-label="Upload Right JSON file"
          onchange={handleFileChange("right")}
        />
      </div>
      <textarea
        id="right-json-input"
        class="form-control"
        rows="10"
        bind:value={rightJson}
      ></textarea>
    </div>
  </div>

  <div class="row mb-4">
    <div class="col text-center">
      <button
        type="button"
        class="btn btn-primary"
        id="compareBtn"
        onclick={handleCompare}
      >
        Compare
      </button>
    </div>
  </div>

  {#if showResult}
    <div id="diffResultContainer" class="row">
      <div class="col-md-6">
        <h4>Left Result</h4>
        <pre id="leftResult" class="form-control diffContainer">{#each leftDifferences as part}<span class={part.removed ? 'removed' : ''}>{part.value}</span>{/each}</pre>
      </div>
      <div class="col-md-6">
        <h4>Right Result</h4>
        <pre id="rightResult" class="form-control diffContainer">{#each rightDifferences as part}<span class={part.added ? 'added' : ''}>{part.value}</span>{/each}</pre>
      </div>
    </div>
  {/if}
</div>
</Layout>
