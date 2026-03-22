<script lang="ts">
  import Layout from "../Layout.svelte";
  import { generateHorizontalLines, getPath, type Point } from "../../domain/amidakuji.ts";

  const MAX_LINES = 15;
  const MIN_LINES = 2;
  const ROWS = 20;

  let numLines = $state(5);
  let topLabels = $state<string[]>(Array.from({ length: 5 }, (_, i) => String(i + 1)));
  let bottomLabels = $state<string[]>(Array.from({ length: 5 }, (_, i) => String(i + 1)));
  let horizontalLines = $state<Point[]>([]);
  let isGenerated = $state(false);
  let selectedStart = $state<number | null>(null);

  // Derive numLines clamping
  function updateLinesCount(value: number) {
    const clamped = Math.max(MIN_LINES, Math.min(value, MAX_LINES));
    if (clamped !== numLines) {
      numLines = clamped;
      // Update labels array size
      topLabels = Array.from(
        { length: clamped },
        (_, i) => topLabels[i] || String(i + 1)
      );
      bottomLabels = Array.from(
        { length: clamped },
        (_, i) => bottomLabels[i] || String(i + 1)
      );
      horizontalLines = [];
      isGenerated = false;
      selectedStart = null;
    }
  }

  function handleNumLinesChange(e: Event) {
    const val = parseInt((e.target as HTMLInputElement).value, 10);
    updateLinesCount(isNaN(val) ? MIN_LINES : val);
  }

  function handleNumLinesBlur(e: Event) {
    const target = e.target as HTMLInputElement;
    let val = parseInt(target.value, 10);
    if (isNaN(val)) val = MIN_LINES;
    const clamped = Math.max(MIN_LINES, Math.min(val, MAX_LINES));
    target.value = clamped.toString();
    updateLinesCount(clamped);
  }

  function handleGenerate() {
    horizontalLines = generateHorizontalLines(numLines, ROWS);
    isGenerated = true;
    selectedStart = null;
  }

  function handleClear() {
    horizontalLines = [];
    isGenerated = false;
    selectedStart = null;
    topLabels = Array.from({ length: numLines }, (_, i) => String(i + 1));
    bottomLabels = Array.from({ length: numLines }, (_, i) => String(i + 1));
  }

  function getColPercent(col: number) {
    if (numLines <= 1) return 50;
    return (col / (numLines - 1)) * 100;
  }

  const selectedPath = $derived(
    selectedStart !== null ? getPath(selectedStart, horizontalLines, ROWS) : null
  );

  const isEndNodeArray = $derived.by(() => {
    const arr = Array(numLines).fill(false);
    if (selectedPath && selectedPath.length > 0) {
      const endPoint = selectedPath[selectedPath.length - 1];
      arr[endPoint.col] = true;
    }
    return arr;
  });

  const width = 100;
  const height = 400;
  const rowSpacing = height / (ROWS + 1);

  const getX = (col: number) => getColPercent(col);
  const getY = (row: number) => (row + 1) * rowSpacing;

  const svgLines = $derived.by(() => {
    let html = "";
    // Vertical lines
    for (let i = 0; i < numLines; i++) {
      html += `<line x1="${getX(i)}" y1="0" x2="${getX(i)}" y2="${height}" stroke="#ccc" stroke-width="4" vector-effect="non-scaling-stroke" />`;
    }
    // Horizontal lines
    if (isGenerated) {
      horizontalLines.forEach((line) => {
        html += `<line x1="${getX(line.col)}" y1="${getY(line.row)}" x2="${getX(line.col + 1)}" y2="${getY(line.row)}" stroke="#ccc" stroke-width="4" vector-effect="non-scaling-stroke" />`;
      });
    }
    // Selected Path
    if (selectedPath) {
      const points = selectedPath
        .map((p) => {
          const y = p.row === -1 ? 0 : p.row === ROWS ? height : getY(p.row);
          return `${getX(p.col)},${y}`;
        })
        .join(" ");
      html += `<polyline points="${points}" fill="none" stroke="red" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />`;
    }
    return html;
  });

</script>

<Layout title="Developer Help Tool - Amidakuji Tool" description="You can play Amidakuji (Ghost Leg) by this tool.">
<div class="container">
  <div class="mb-4">
    <label for="numLinesInput" class="form-label">Number of Lines (2-15):</label>
    <input
      type="number"
      id="numLinesInput"
      class="form-control"
      value={numLines}
      min="2"
      max="15"
      style="max-width: 200px"
      onchange={handleNumLinesChange}
      onblur={handleNumLinesBlur}
    />
    <div class="mt-3">
      <button
        type="button"
        class="btn btn-primary me-2"
        onclick={handleGenerate}
      >
        生成 (Generate)
      </button>
      <button
        type="button"
        class="btn btn-outline-secondary"
        onclick={handleClear}
      >
        クリア (Clear)
      </button>
    </div>
  </div>

  <div class="amidakujiBoard" id="boardContainer">
    <div class="amidakujiInner">
      <!-- Top Labels -->
      <div class="labelsRow" id="topLabelsContainer">
        {#each topLabels as label, i}
          <div class="labelContainer" style="left: {getColPercent(i)}%">
            <input
              type="text"
              class="form-control labelInput top-label-input"
              bind:value={topLabels[i]}
              readonly={isGenerated}
              style="cursor: {isGenerated ? 'pointer' : 'default'}; border-color: {isGenerated && selectedStart === i ? 'red' : ''}; border-width: {isGenerated && selectedStart === i ? '2px' : ''};"
              onclick={() => {
                if (isGenerated) selectedStart = i;
              }}
            />
            {#if isGenerated}
              <button
                type="button"
                class="btn btn-sm btn-outline-danger mt-1 select-btn"
                onclick={() => selectedStart = i}
              >
                Select
              </button>
            {/if}
          </div>
        {/each}
      </div>

      <!-- SVG -->
      <div class="svgWrapper" id="svgWrapper">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 {width} {height}"
          preserveAspectRatio="none"
          class="svgContainer"
        >
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html svgLines}
        </svg>
      </div>

      <!-- Bottom Labels -->
      <div class="labelsRow bottomLabelsRow" id="bottomLabelsContainer">
        {#each bottomLabels as label, i}
          <div class="labelContainer" style="left: {getColPercent(i)}%">
            <input
              type="text"
              class="form-control labelInput bottom-label-input"
              bind:value={bottomLabels[i]}
              readonly={isGenerated}
              style="border-color: {isEndNodeArray[i] ? 'red' : ''}; border-width: {isEndNodeArray[i] ? '2px' : ''}; background-color: {isEndNodeArray[i] ? '#ffe6e6' : ''};"
            />
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .amidakujiBoard {
    margin-top: 30px;
    width: 100%;
    overflow-x: auto;
    display: flex;
    justify-content: center;
  }
  .amidakujiInner {
    position: relative;
    width: 100%;
    max-width: 1000px;
    min-width: 300px;
    padding: 0 40px;
    box-sizing: border-box;
  }
  .labelsRow {
    position: relative;
    width: 100%;
    height: 80px;
  }
  .labelsRow.bottomLabelsRow {
    height: 40px;
  }
  .labelContainer {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60px;
    transform: translateX(-50%);
  }
  .labelInput {
    text-align: center;
    padding: 4px;
    font-size: 14px;
    width: 100%;
  }
  .svgWrapper {
    width: 100%;
    margin: 10px 0;
  }
  .svgContainer {
    display: block;
    width: 100%;
    height: 400px;
    overflow: visible;
  }
</style>
</Layout>
