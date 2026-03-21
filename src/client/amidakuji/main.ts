import {
  generateHorizontalLines,
  getPath,
  type Point,
} from "../../domain/amidakuji.ts";

const MAX_LINES = 15;
const MIN_LINES = 2;
const ROWS = 20;

const numLinesInput = document.getElementById(
  "numLinesInput",
) as HTMLInputElement;
const generateBtn = document.getElementById("generateBtn") as HTMLButtonElement;
const clearBtn = document.getElementById("clearBtn") as HTMLButtonElement;
const topLabelsContainer = document.getElementById(
  "topLabelsContainer",
) as HTMLDivElement;
const bottomLabelsContainer = document.getElementById(
  "bottomLabelsContainer",
) as HTMLDivElement;
const svgWrapper = document.getElementById("svgWrapper") as HTMLDivElement;

const state = {
  numLines: 5,
  topLabels: Array.from({ length: 5 }, (_, i) => String(i + 1)),
  bottomLabels: Array.from({ length: 5 }, (_, i) => String(i + 1)),
  horizontalLines: [] as Point[],
  isGenerated: false,
  selectedStart: null as number | null,
};

function updateLinesCount(value: string) {
  let val = parseInt(value, 10);
  if (isNaN(val)) val = MIN_LINES;
  const clamped = Math.max(MIN_LINES, Math.min(val, MAX_LINES));

  if (clamped !== state.numLines) {
    state.numLines = clamped;

    // Update labels array size
    state.topLabels = Array.from(
      { length: clamped },
      (_, i) => state.topLabels[i] || String(i + 1),
    );
    state.bottomLabels = Array.from(
      { length: clamped },
      (_, i) => state.bottomLabels[i] || String(i + 1),
    );

    state.horizontalLines = [];
    state.isGenerated = false;
    state.selectedStart = null;
  }

  render();
}

numLinesInput.addEventListener("change", (e) => {
  updateLinesCount((e.target as HTMLInputElement).value);
});

numLinesInput.addEventListener("blur", (e) => {
  const target = e.target as HTMLInputElement;
  let val = parseInt(target.value, 10);
  if (isNaN(val)) val = MIN_LINES;
  target.value = Math.max(MIN_LINES, Math.min(val, MAX_LINES)).toString();
});

generateBtn.addEventListener("click", () => {
  state.horizontalLines = generateHorizontalLines(state.numLines, ROWS);
  state.isGenerated = true;
  state.selectedStart = null;
  render();
});

clearBtn.addEventListener("click", () => {
  state.horizontalLines = [];
  state.isGenerated = false;
  state.selectedStart = null;
  state.topLabels = Array.from(
    { length: state.numLines },
    (_, i) => String(i + 1),
  );
  state.bottomLabels = Array.from(
    { length: state.numLines },
    (_, i) => String(i + 1),
  );
  render();
});

function render() {
  const selectedPath = state.selectedStart !== null
    ? getPath(state.selectedStart, state.horizontalLines, ROWS)
    : null;
  const isEndNodeArray = Array(state.numLines).fill(false);

  if (selectedPath && selectedPath.length > 0) {
    const endPoint = selectedPath[selectedPath.length - 1];
    isEndNodeArray[endPoint.col] = true;
  }

  const getColPercent = (col: number) => {
    if (state.numLines <= 1) return 50;
    return (col / (state.numLines - 1)) * 100;
  };

  // Top Labels
  topLabelsContainer.innerHTML = "";
  state.topLabels.forEach((label, i) => {
    const container = document.createElement("div");
    container.className = "labelContainer";
    container.style.left = `${getColPercent(i)}%`;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "form-control labelInput top-label-input";
    input.value = label;
    input.dataset.index = i.toString();
    if (state.isGenerated) {
      input.readOnly = true;
      input.style.cursor = "pointer";
      if (state.selectedStart === i) {
        input.style.borderColor = "red";
        input.style.borderWidth = "2px";
      }
    }

    container.appendChild(input);

    if (state.isGenerated) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-sm btn-outline-danger mt-1 select-btn";
      btn.textContent = "Select";
      btn.dataset.index = i.toString();
      container.appendChild(btn);
    }

    topLabelsContainer.appendChild(container);
  });

  // Bottom Labels
  bottomLabelsContainer.innerHTML = "";
  state.bottomLabels.forEach((label, i) => {
    const container = document.createElement("div");
    container.className = "labelContainer";
    container.style.left = `${getColPercent(i)}%`;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "form-control labelInput bottom-label-input";
    input.value = label;
    input.dataset.index = i.toString();
    if (state.isGenerated) {
      input.readOnly = true;
    }
    if (isEndNodeArray[i]) {
      input.style.borderColor = "red";
      input.style.borderWidth = "2px";
      input.style.backgroundColor = "#ffe6e6";
    }

    container.appendChild(input);
    bottomLabelsContainer.appendChild(container);
  });

  // SVG
  const width = 100;
  const height = 400; // Keep height relatively large to maintain line aspect ratio in percentage space
  const rowSpacing = height / (ROWS + 1);

  const getX = (col: number) => getColPercent(col);
  const getY = (row: number) => (row + 1) * rowSpacing;

  let svgHtml = `
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 ${width} ${height}"
      preserveAspectRatio="none"
      class="svgContainer"
    >
  `;

  // Vertical lines
  for (let i = 0; i < state.numLines; i++) {
    svgHtml += `<line x1="${getX(i)}" y1="0" x2="${
      getX(i)
    }" y2="${height}" stroke="#ccc" stroke-width="4" vector-effect="non-scaling-stroke" />`;
  }

  // Horizontal lines
  if (state.isGenerated) {
    state.horizontalLines.forEach((line) => {
      svgHtml += `<line x1="${getX(line.col)}" y1="${
        getY(
          line.row,
        )
      }" x2="${getX(line.col + 1)}" y2="${
        getY(
          line.row,
        )
      }" stroke="#ccc" stroke-width="4" vector-effect="non-scaling-stroke" />`;
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

    svgHtml +=
      `<polyline points="${points}" fill="none" stroke="red" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />`;
  }

  svgHtml += `</svg>`;
  svgWrapper.innerHTML = svgHtml;
}

// Event Delegation for Labels
document.body.addEventListener("input", (e) => {
  const target = e.target as HTMLInputElement;
  if (target.classList.contains("top-label-input")) {
    const idx = parseInt(target.dataset.index!, 10);
    state.topLabels[idx] = target.value;
  } else if (target.classList.contains("bottom-label-input")) {
    const idx = parseInt(target.dataset.index!, 10);
    state.bottomLabels[idx] = target.value;
  }
});

document.body.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (state.isGenerated && target.classList.contains("top-label-input")) {
    state.selectedStart = parseInt(target.dataset.index!, 10);
    render();
  } else if (state.isGenerated && target.classList.contains("select-btn")) {
    state.selectedStart = parseInt(target.dataset.index!, 10);
    render();
  }
});

// Initial render
render();
