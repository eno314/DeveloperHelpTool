import {
  EncodeDecodeMode as EncodingMode,
  toDecodedText,
  toEncodedText,
} from "../../utils/encodeDecodeUtils.ts";

const modeSelect = document.getElementById("modeSelect") as HTMLSelectElement;
const encodingTextarea = document.getElementById(
  "encodingTextarea",
) as HTMLTextAreaElement;
const decodingTextarea = document.getElementById(
  "decodingTextarea",
) as HTMLTextAreaElement;
const encodingTextareaLabel = document.getElementById(
  "encodingTextareaLabel",
) as HTMLLabelElement;
const leftUploadContainer = document.getElementById(
  "leftUploadContainer",
) as HTMLDivElement;
const rightUploadContainer = document.getElementById(
  "rightUploadContainer",
) as HTMLDivElement;

modeSelect.addEventListener("change", (e) => {
  const mode = (e.target as HTMLSelectElement).value;
  encodingTextarea.value = "";
  decodingTextarea.value = "";

  if (mode === "JSON") {
    leftUploadContainer.classList.remove("d-none");
    rightUploadContainer.classList.remove("d-none");
  } else {
    leftUploadContainer.classList.add("d-none");
    rightUploadContainer.classList.add("d-none");
  }

  if (mode === "Base64") {
    encodingTextareaLabel.textContent =
      "Please input text you'd like to encode. (UTF-8)";
    encodingTextarea.placeholder = "UTF-8";
  } else {
    encodingTextareaLabel.textContent =
      "Please input text you'd like to encode.";
    encodingTextarea.placeholder = "";
  }
});

document.getElementById("encodeBtn")?.addEventListener("click", () => {
  const mode = modeSelect.value as EncodingMode;
  const text = encodingTextarea.value;
  decodingTextarea.value = toEncodedText(text, mode);
});

document.getElementById("decodeBtn")?.addEventListener("click", () => {
  const mode = modeSelect.value as EncodingMode;
  const text = decodingTextarea.value;
  encodingTextarea.value = toDecodedText(text, mode);
});

const handleFileChange = (targetElementId: string) => (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target?.result;
    if (typeof content === "string") {
      (document.getElementById(targetElementId) as HTMLTextAreaElement).value =
        content;
    }
  };
  reader.readAsText(file);
  target.value = "";
};

document.getElementById("left-upload")?.addEventListener(
  "change",
  handleFileChange("encodingTextarea"),
);
document.getElementById("right-upload")?.addEventListener(
  "change",
  handleFileChange("decodingTextarea"),
);
