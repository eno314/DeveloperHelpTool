import { expect, test } from "@playwright/test";

test.describe("String Replace Tool (Hono)", () => {
  test("should replace strings based on the target and new substring", async ({ page }) => {
    // Navigate to the Hono proof-of-concept page
    await page.goto("http://localhost:8000/string/replace/index.html");

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
});
