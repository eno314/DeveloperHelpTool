import { expect, test } from "@playwright/test";

test.describe("Timestamp Tool (Hono)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8000/timestamp/index.html");
  });

  test("should display the Timestamp Tool page correctly", async ({ page }) => {
    // Check main title
    await expect(page.locator("h1")).toContainText("Developer Help Tool");

    // Check subtitle
    await expect(page.locator("h5").first()).toContainText(
      "Current Unix Timestamp (Seconds)",
    );

    // Wait for client-side rendering to complete and the unix timestamp to show up
    const timestampValue = page.locator("#currentTimestamp");
    await expect(timestampValue).toBeVisible();

    // Validate it's a number
    const text = await timestampValue.textContent();
    expect(Number(text)).not.toBeNaN();
    expect(Number(text)).toBeGreaterThan(0);

    // Check Current Time section
    await expect(page.locator("h5", { hasText: "Current Time" })).toBeVisible();

    // Check table headers
    await expect(
      page.locator("th", { hasText: "Timezone / City" }),
    ).toBeVisible();
    await expect(
      page.locator("th", { hasText: "Time (YYYY-MM-DD HH:mm:ss)" }),
    ).toBeVisible();

    // Check specific rows
    await expect(page.locator("td", { hasText: "Local Time" })).toBeVisible();
    await expect(page.locator("td", { hasText: "UTC (GMT)" })).toBeVisible();
    await expect(page.getByLabel("Select timezone")).toBeVisible();

    // Check Timestamp Converter section exists
    await expect(
      page.locator("h5", { hasText: "Timestamp Converter" }),
    ).toBeVisible();
  });

  test("should verify the Timestamp Converter functionality", async ({ page }) => {
    const timestampInput = page.getByLabel("Unix Timestamp (Seconds)");
    const localTimeInput = page.getByLabel("Local Time (YYYY-MM-DD HH:mm:ss)");
    const utcTimeInput = page.getByLabel("UTC Time (YYYY-MM-DD HH:mm:ss)");

    await expect(timestampInput).toBeVisible();
    await expect(localTimeInput).toBeVisible();
    await expect(utcTimeInput).toBeVisible();

    // Set a known UTC timestamp (2025-01-01 12:00:00 UTC = 1735732800)
    await timestampInput.fill("1735732800");

    // Check if UTC Time input updates correctly
    await expect(utcTimeInput).toHaveValue("2025-01-01 12:00:00");

    // Update the UTC Time input to a new time
    await utcTimeInput.fill("2025-01-02 12:00:00");

    // Verify timestamp input updates correctly (1735819200)
    await expect(timestampInput).toHaveValue("1735819200");

    // Update the local time input with a known pattern to verify connection
    // Note: Playwright test browser runs with UTC timezone by default, so Local and UTC will usually match,
    // but we can at least test bidirectional data flow.
    await localTimeInput.fill("2025-01-03 12:00:00");
    await expect(utcTimeInput).toHaveValue("2025-01-03 12:00:00");
    await expect(timestampInput).toHaveValue("1735905600");
  });

  test("should verify the copy button functionality", async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    const copyButton = page.getByRole("button", { name: "Copy timestamp" });
    await expect(copyButton).toBeVisible();

    // Click the copy button
    await copyButton.click();

    // Check if the button text changes to "Copied!"
    await expect(copyButton).toContainText("Copied!");

    // Check clipboard content
    const clipboardText = await page.evaluate("navigator.clipboard.readText()");

    // Check that what was copied is a valid number (timestamp)
    expect(Number(clipboardText)).not.toBeNaN();
    expect(Number(clipboardText)).toBeGreaterThan(0);

    // Now test a row copy button
    const copyUtcButton = page.getByRole("button", {
      name: "Copy time for UTC (GMT)",
    });
    await expect(copyUtcButton).toBeVisible();

    // Click the UTC row copy button
    await copyUtcButton.click();
    await expect(copyUtcButton).toContainText("Copied!");

    // Check clipboard content
    const utcClipboardText = await page.evaluate(
      "navigator.clipboard.readText()",
    );

    // Check that it's a formatted date string matching roughly YYYY-MM-DD HH:mm:ss
    expect(utcClipboardText).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);

    // Test the select timezone copy functionality
    const select = page.getByLabel("Select timezone");
    await select.selectOption("Asia/Tokyo");

    const copySelectedBtn = page.getByRole("button", {
      name: "Copy time for selected timezone",
    });
    await expect(copySelectedBtn).toBeVisible();
    await copySelectedBtn.click();
    await expect(copySelectedBtn).toContainText("Copied!");
  });
});
