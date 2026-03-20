import { replaceStr } from "@/utils/stringUtils";

document.getElementById("applyBtn")?.addEventListener("click", () => {
  const replacedStr = (
    document.getElementById("replacedTextarea") as HTMLTextAreaElement
  ).value;
  const targetSubstr = (
    document.getElementById("targetSubstr") as HTMLInputElement
  ).value;
  const newSubstr = (document.getElementById("newSubstr") as HTMLInputElement)
    .value;

  const result = replaceStr(replacedStr, targetSubstr, newSubstr);
  (document.getElementById("newTextarea") as HTMLTextAreaElement).value =
    result;
});
