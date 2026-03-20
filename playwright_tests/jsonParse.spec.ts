import { expect, test } from "@playwright/test";
import { Buffer } from "node:buffer";

test.describe("JSON Parse Tool Tests", () => {
  test("should parse JSON string with object and array successfully", async ({ page }) => {
    // Navigate to the JSON Parse Tool page
    await page.goto("/json/parse");

    // Input JSON string
    const inputJson = JSON.stringify(
      {
        user: {
          name: "Alice",
          age: 30,
        },
        tags: ["developer", "typescript"],
      },
      null,
      2,
    );

    const expectedParsedResult = `object(
  user : object(
    name : Alice
    age : 30
  )
  tags : object(
    0 : developer
    1 : typescript
  )
)`;

    // Fill the input textarea
    await page.fill("#jsonTextarea", inputJson);

    // Click the "Parse JSON" button
    await page.click('button:has-text("Parse JSON")');

    // Verify the output in the result textarea
    const resultTextarea = page.locator("#resultTextarea");
    await expect(resultTextarea).toHaveValue(expectedParsedResult);
  });
  test("should parse JSON from uploaded file successfully", async ({ page }) => {
    await page.goto("/json/parse");

    const inputJson = JSON.stringify({ file: "upload" });
    const expectedParsedResult = `object(
  file : upload
)`;

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByLabel("Upload JSON file").click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: "test.json",
      mimeType: "application/json",
      buffer: Buffer.from(inputJson),
    });

    await expect(page.locator("#jsonTextarea")).toHaveValue(inputJson);

    await page.click('button:has-text("Parse JSON")');

    await expect(page.locator("#resultTextarea")).toHaveValue(
      expectedParsedResult,
    );
  });
});
