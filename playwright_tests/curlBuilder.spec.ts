import { expect, test } from "@playwright/test";

test.describe("Curl Builder Tool Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8000/curl/builder/index.html");
  });

  test("should generate default curl command", async ({ page }) => {
    await expect(page).toHaveTitle("Developer Help Tool - Curl Builder Tool");

    const outputTextarea = page.locator("#curlOutput");
    await expect(outputTextarea).toHaveValue('curl ""');
  });

  test("should update curl command when URL is entered", async ({ page }) => {
    await page.fill("#urlInput", "https://example.com/api");

    const outputTextarea = page.locator("#curlOutput");
    await expect(outputTextarea).toHaveValue('curl "https://example.com/api"');
  });

  test("should handle changing method to POST and add body", async ({ page }) => {
    // URL
    await page.fill("#urlInput", "http://localhost");

    // Method
    await page.selectOption("#methodSelect", "POST");

    // Output should update
    const outputTextarea = page.locator("#curlOutput");
    await expect(outputTextarea).toHaveValue('curl -X POST "http://localhost"');

    // Fill Body
    await page.fill("#bodyTextarea", '{"test": 123}');

    await expect(outputTextarea).toHaveValue(
      'curl -X POST "http://localhost" -d \'{"test": 123}\'',
    );
  });

  test("should add, edit, and remove headers", async ({ page }) => {
    // Add header
    await page.click('button:has-text("+ Add Header")');

    // Fill Header 1
    await page.fill(
      'input[placeholder="Key (e.g., Content-Type)"]',
      "Authorization",
    );
    await page.fill(
      'input[placeholder="Value (e.g., application/json)"]',
      "Bearer token",
    );

    const outputTextarea = page.locator("#curlOutput");
    await expect(outputTextarea).toHaveValue(
      'curl "" -H "Authorization: Bearer token"',
    );

    // Remove Header
    await page.click('button[aria-label="Remove header"]');
    await expect(outputTextarea).toHaveValue('curl ""');
  });

  test("should verify body quote escaping", async ({ page }) => {
    await page.selectOption("#methodSelect", "PUT");

    await page.fill("#bodyTextarea", "It's a test");

    const outputTextarea = page.locator("#curlOutput");
    await expect(outputTextarea).toHaveValue(
      "curl -X PUT \"\" -d 'It'\\''s a test'",
    );
  });
});
