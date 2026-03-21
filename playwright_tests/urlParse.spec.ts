import { expect, test } from "@playwright/test";

test.describe("Url Parse Tool", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the page
    await page.goto(
      "http://localhost:8000/DeveloperHelpTool/url/parse/index.html",
    );
  });

  test("should parse URL with multibyte query parameters", async ({ page }) => {
    // Input URL with multibyte query parameter
    const inputUrl = "https://example.com/search?q=テスト&lang=ja";

    // Fill the parsed URL input
    await page.locator("#parsedUrl").fill(inputUrl);

    // Click the parse button
    await page.locator("#parseUrlBtn").click();

    // Verify Base URL
    await expect(page.locator("#baseUrl")).toHaveValue(
      "https://example.com/search",
    );

    // Verify URL parameters in the table
    // Row 1 (q=テスト)
    await expect(
      page.locator("tbody tr:nth-child(1) td:nth-child(1) input"),
    ).toHaveValue("q");
    await expect(
      page.locator("tbody tr:nth-child(1) td:nth-child(2) input"),
    ).toHaveValue("テスト");

    // Row 2 (lang=ja)
    await expect(
      page.locator("tbody tr:nth-child(2) td:nth-child(1) input"),
    ).toHaveValue("lang");
    await expect(
      page.locator("tbody tr:nth-child(2) td:nth-child(2) input"),
    ).toHaveValue("ja");
  });

  test("should build URL with multibyte encoding and parameter deletion", async ({ page }) => {
    // Fill the Base URL input
    await page
      .locator("#baseUrl")
      .fill("https://example.com/search");

    // Add first parameter (q=テスト)
    await page.locator("#addParamBtn").click();
    await page.locator("tbody tr:nth-child(1) td:nth-child(1) input").fill("q");
    await page
      .locator("tbody tr:nth-child(1) td:nth-child(2) input")
      .fill("テスト");

    // Add second parameter (lang=ja)
    await page.locator("#addParamBtn").click();
    await page
      .locator("tbody tr:nth-child(2) td:nth-child(1) input")
      .fill("lang");
    await page
      .locator("tbody tr:nth-child(2) td:nth-child(2) input")
      .fill("ja");

    // Delete the second parameter (lang=ja)
    await page
      .locator("tbody tr:nth-child(2) td:nth-child(3) button", {
        hasText: "delete",
      })
      .click();

    // Click the build button
    await page.locator("#buildUrlBtn").click();

    // Verify the output in the Parsed URL input
    const expectedUrl =
      "https://example.com/search?q=%E3%83%86%E3%82%B9%E3%83%88";
    await expect(
      page.locator("#parsedUrl"),
    ).toHaveValue(expectedUrl);
  });
});
