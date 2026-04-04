import { expect, test } from "@playwright/test";

test.describe("String Replace Tool", () => {
  test("should replace strings based on the target and new substring", async ({ page }) => {
    // Navigate to the page
    await page.goto(
      "http://localhost:8000/DeveloperHelpTool/string/replace/",
    );

    // Input the original string
    const replacedTextarea = page.locator("#replacedTextarea");
    await replacedTextarea.fill("hello world hello");

    // Input the target substring
    const targetSubstrInput = page.locator("#targetSubstr");
    await targetSubstrInput.fill("hello");

    // Input the new substring
    const newSubstrInput = page.locator("#newSubstr");
    await newSubstrInput.fill("hi");

    // Click the Apply button
    const applyBtn = page.locator("#applyBtn");
    await applyBtn.click();

    // Verify the replaced string
    const newTextarea = page.locator("#newTextarea");
    await expect(newTextarea).toHaveValue("hi world hi");
  });

  test("should disable Apply button when target substring exceeds 100 characters", async ({ page }) => {
    await page.goto(
      "http://localhost:8000/DeveloperHelpTool/string/replace/",
    );

    const targetSubstrInput = page.locator("#targetSubstr");
    const applyBtn = page.locator("#applyBtn");

    // Input string of length 100 (button should be enabled)
    await targetSubstrInput.fill("a".repeat(100));
    await expect(applyBtn).toBeEnabled();

    // Input string of length 101 (button should be disabled)
    await targetSubstrInput.fill("a".repeat(101));
    await expect(applyBtn).toBeDisabled();
  });
});
