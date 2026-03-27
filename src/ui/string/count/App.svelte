<script lang="ts">
  import Layout from "../../Layout.svelte";
  import { countBytes } from "../../../utils/stringUtils.ts";

  let inputStr = $state("");

  let charCount = $derived(inputStr.length);
  let byteCount = $derived(countBytes(inputStr));
</script>

<style>
  .textarea {
    height: 800px;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .resultBox {
    margin-top: 5px;
    margin-bottom: 5px;
  }
</style>

<Layout title="Developer Help Tool - String Count Tool" description="You can count characters and bytes of string by this tool.">
<div class="container">
  <div class="row form-floating">
    <textarea
      class="form-control textarea"
      id="inputTextarea"
      bind:value={inputStr}
    ></textarea>
    <label for="inputTextarea">
      Please input text you'd like to count.
    </label>
  </div>
  <div class="row resultBox">
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Character Count (Length)</h5>
          <p class="card-text fs-4" id="charCountDisplay">{charCount}</p>
          <p class="card-text text-muted small">
            Note: This uses standard JavaScript `length` property. It counts UTF-16 code units, so surrogate pairs or some emojis may be counted as 2 or more characters.
          </p>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">UTF-8 Byte Count</h5>
          <p class="card-text fs-4" id="byteCountDisplay">{byteCount}</p>
        </div>
      </div>
    </div>
  </div>
</div>
</Layout>
