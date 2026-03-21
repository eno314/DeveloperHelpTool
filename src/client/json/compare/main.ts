import { diffLines, Change as DiffResult } from "../../../utils/diff.ts";

// DOM Elements
const leftFileInput = document.getElementById(
  "left-file-input",
) as HTMLInputElement;
const rightFileInput = document.getElementById(
  "right-file-input",
) as HTMLInputElement;
const leftTextarea = document.getElementById(
  "left-json-input",
) as HTMLTextAreaElement;
const rightTextarea = document.getElementById(
  "right-json-input",
) as HTMLTextAreaElement;
const compareBtn = document.getElementById("compareBtn") as HTMLButtonElement;
const errorAlert = document.getElementById("errorAlert") as HTMLDivElement;
const diffResultContainer = document.getElementById(
  "diffResultContainer",
) as HTMLDivElement;
const leftResult = document.getElementById("leftResult") as HTMLPreElement;
const rightResult = document.getElementById("rightResult") as HTMLPreElement;

const handleFileChange = (textareaElement: HTMLTextAreaElement) => {
  return (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        textareaElement.value = content;
      }
    };
    reader.readAsText(file);
    target.value = "";
  };
};

leftFileInput.addEventListener("change", handleFileChange(leftTextarea));
rightFileInput.addEventListener("change", handleFileChange(rightTextarea));

compareBtn.addEventListener("click", () => {
  errorAlert.classList.add("d-none");
  diffResultContainer.classList.add("d-none");
  leftResult.innerHTML = "";
  rightResult.innerHTML = "";

  let parsedLeft;
  let parsedRight;

  try {
    parsedLeft = JSON.parse(leftTextarea.value);
  } catch {
    errorAlert.textContent = "Left JSON is invalid.";
    errorAlert.classList.remove("d-none");
    return;
  }

  try {
    parsedRight = JSON.parse(rightTextarea.value);
  } catch {
    errorAlert.textContent = "Right JSON is invalid.";
    errorAlert.classList.remove("d-none");
    return;
  }

  const formattedLeft = JSON.stringify(parsedLeft, null, 2);
  const formattedRight = JSON.stringify(parsedRight, null, 2);

  const differences = diffLines(formattedLeft, formattedRight);

  diffResultContainer.classList.remove("d-none");

  // Render left
  differences.forEach((part: DiffResult) => {
    if (part.added) return;
    const span = document.createElement("span");
    span.textContent = part.value;
    if (part.removed) span.className = "removed";
    leftResult.appendChild(span);
  });

  // Render right
  differences.forEach((part: DiffResult) => {
    if (part.removed) return;
    const span = document.createElement("span");
    span.textContent = part.value;
    if (part.added) span.className = "added";
    rightResult.appendChild(span);
  });
});
