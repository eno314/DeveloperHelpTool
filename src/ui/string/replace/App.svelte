<script lang="ts">
  import Layout from "../../Layout.svelte";
  import { replaceStr } from "../../../utils/stringUtils.ts";

  let replacedStr = $state("");
  let targetSubstr = $state("");
  let newSubstr = $state("");
  let result = $state("");

  function applyReplace() {
    result = replaceStr(replacedStr, targetSubstr, newSubstr);
  }
</script>

<style>
  .textarea {
    height: 200px;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .buttonsRow {
    margin-top: 5px;
    margin-bottom: 5px;
  }
</style>

<Layout title="Developer Help Tool - String Replace Tool" description="You can replace string by this tool.">
<div class="container">
  <div class="row form-floating">
    <textarea
      class="form-control textarea"
      id="replacedTextarea"
      bind:value={replacedStr}
    ></textarea>
    <label for="replacedTextarea">
      Please input text you'd like to replace.
    </label>
  </div>
  <div class="row buttonsRow">
    <div class="input-group mb-3 col">
      <span class="input-group-text" id="targetSubstrSpan">
        target substr
      </span>
      <input
        aria-describedby="targetSubstrSpan"
        class="form-control"
        id="targetSubstr"
        placeholder="Supports regular expression"
        type="text"
        bind:value={targetSubstr}
      />
    </div>
    <div class="input-group mb-3 col">
      <span class="input-group-text" id="newSubstrSpan">
        new substr
      </span>
      <input
        aria-describedby="newSubstrSpan"
        class="form-control"
        id="newSubstr"
        type="text"
        bind:value={newSubstr}
      />
    </div>
  </div>
  <div class="row buttonsRow">
    <div class="col text-center">
      <button
        type="button"
        class="btn btn-primary"
        id="applyBtn"
        onclick={applyReplace}
        disabled={targetSubstr.length > 100}
      >
        ▼ Apply
      </button>
    </div>
  </div>
  <div class="row form-floating">
    <textarea
      class="form-control textarea"
      id="newTextarea"
      readonly
      value={result}
    ></textarea>
    <label for="newTextarea">
      If you click apply button, replaced string will appear here.
    </label>
  </div>
</div>
</Layout>
