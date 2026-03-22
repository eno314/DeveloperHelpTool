<script lang="ts">
  import Layout from "../../Layout.svelte";
  import {
    addUrlParam,
    createUrlText,
    parseUrl,
    removeUrlParamOf,
    updateUrlParams,
    type UrlParam,
  } from "../../../domain/urlParse.ts";

  // State
  let parsedUrlText = $state("");
  let baseUrlText = $state("");
  let urlParams: UrlParam[] = $state([]);

  const handleParseUrl = () => {
    const result = parseUrl(parsedUrlText);
    baseUrlText = result.baseUrlText;
    urlParams = result.urlParams;
  };

  const handleBuildUrl = () => {
    parsedUrlText = createUrlText(baseUrlText, urlParams);
  };

  const handleAddParam = () => {
    urlParams = addUrlParam(urlParams);
  };

  const handleDeleteParam = (index: number) => {
    urlParams = removeUrlParamOf(index, urlParams);
  };

  const handleUpdateParam = (index: number, type: "key" | "value", value: string) => {
    urlParams = updateUrlParams(urlParams, index, type, value);
  };
</script>

<Layout title="Developer Help Tool - Url Parse Tool" description="You can parse and build url by this tool.">
<div class="card mt-4">
  <div class="card-header">
    Url Parse Tool
  </div>
  <div class="card-body">
    <div class="container">
      <div class="input-group mb-3">
        <span class="input-group-text" id="parsedUrlLabel">
          Parsed URL
        </span>
        <input
          type="url"
          class="form-control"
          aria-describedby="parsedUrlLabel"
          id="parsedUrl"
          bind:value={parsedUrlText}
        />
      </div>

      <div class="row" style="margin-top: 10px; margin-bottom: 10px">
        <div class="col text-center">
          <button
            type="button"
            class="btn btn-primary"
            id="parseUrlBtn"
            onclick={handleParseUrl}
          >
            ▼ Parse URL
          </button>
        </div>
        <div class="col text-center">
          <button
            type="button"
            class="btn btn-primary"
            id="buildUrlBtn"
            onclick={handleBuildUrl}
          >
            ▲ Build URL
          </button>
        </div>
      </div>

      <div>
        <div class="input-group mb-3">
          <span class="input-group-text" id="baseUrlLabel">
            Base URL
          </span>
          <input
            type="url"
            class="form-control"
            aria-describedby="baseUrlLabel"
            id="baseUrl"
            bind:value={baseUrlText}
          />
        </div>

        <table class="table table-sm">
          <thead>
            <tr>
              <th scope="col">URL PARAM KEY</th>
              <th scope="col">URL PARAM VALUE</th>
              <th scope="col">DELETE</th>
            </tr>
          </thead>
          <tbody id="urlParamsTableBody">
            {#each urlParams as param, index}
              <tr>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    value={param.key}
                    oninput={(e) => handleUpdateParam(index, "key", e.currentTarget.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    value={param.value}
                    oninput={(e) => handleUpdateParam(index, "value", e.currentTarget.value)}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    onclick={() => handleDeleteParam(index)}
                  >
                    delete
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>

        <div style="text-align: center">
          <button
            type="button"
            class="btn btn-secondary"
            id="addParamBtn"
            onclick={handleAddParam}
          >
            add param
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</Layout>
