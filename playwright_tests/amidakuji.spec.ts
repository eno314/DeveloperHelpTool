import { expect, test } from "@playwright/test";

test.describe("Amidakuji Page Tests - Happy Path", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "http://localhost:8000/DeveloperHelpTool/amidakuji/index.html",
    );
  });

  test("should verify the number of vertical lines for 2 and 15", async ({ page }) => {
    const numLinesInput = page.getByLabel("Number of Lines (2-15):");

    // Test for 2 lines
    await numLinesInput.fill("2");
    await numLinesInput.blur();

    // There are top and bottom labels, we count the SVG lines
    let lines = page.locator("svg line");
    await expect(lines).toHaveCount(2);

    // Test for 15 lines
    await numLinesInput.fill("15");
    await numLinesInput.blur();

    lines = page.locator("svg line");
    await expect(lines).toHaveCount(15);
  });

  test("should allow editing start and end points in the initial state", async ({ page }) => {
    // Top labels
    const topInputs = page
      .locator("#topLabelsContainer")
      .locator('input[type="text"]');
    await topInputs.nth(0).fill("Start 1");
    await expect(topInputs.nth(0)).toHaveValue("Start 1");
    await expect(topInputs.nth(0)).not.toHaveAttribute("readonly");

    // Bottom labels
    const bottomInputs = page
      .locator("#bottomLabelsContainer")
      .locator('input[type="text"]');
    await bottomInputs.nth(0).fill("End 1");
    await expect(bottomInputs.nth(0)).toHaveValue("End 1");
    await expect(bottomInputs.nth(0)).not.toHaveAttribute("readonly");
  });

  test("should disable editing, draw lines, and show red path upon generation and selection", async ({ page }) => {
    // Generate lines
    await page.getByRole("button", { name: "生成 (Generate)" }).click();

    // Verify horizontal lines are generated (total lines > 5 since default is 5 vertical lines + some horizontal lines)
    const lines = page.locator("svg line");
    const linesCount = await lines.count();
    expect(linesCount).toBeGreaterThan(5);

    // Verify inputs are readonly
    const topInputs = page
      .locator("#topLabelsContainer")
      .locator('input[type="text"]');
    await expect(topInputs.nth(0)).toHaveAttribute("readonly", "");

    const bottomInputs = page
      .locator("#bottomLabelsContainer")
      .locator('input[type="text"]');
    await expect(bottomInputs.nth(0)).toHaveAttribute("readonly", "");

    // Select a start point to draw the red path
    await page.getByRole("button", { name: "Select" }).first().click();

    // Verify the red path (polyline with stroke="red") is rendered
    const redPath = page.locator('svg polyline[stroke="red"]');
    await expect(redPath).toBeVisible();
  });

  test("should reset to initial state upon clicking clear", async ({ page }) => {
    const numLinesInput = page.getByLabel("Number of Lines (2-15):");
    await numLinesInput.fill("3");
    await numLinesInput.blur();

    const topInputs = page
      .locator("#topLabelsContainer")
      .locator('input[type="text"]');
    await topInputs.nth(0).fill("Start 1");

    await page.getByRole("button", { name: "生成 (Generate)" }).click();
    await page.getByRole("button", { name: "Select" }).first().click();

    // Clear
    await page.getByRole("button", { name: "クリア (Clear)" }).click();

    // Verify initial state
    // 1. Only 3 vertical lines (no horizontal lines)
    const lines = page.locator("svg line");
    await expect(lines).toHaveCount(3);

    // 2. No red path
    const redPath = page.locator('svg polyline[stroke="red"]');
    await expect(redPath).toHaveCount(0);

    // 3. Inputs are editable again and reset to default values (1, 2, 3...)
    await expect(topInputs.nth(0)).not.toHaveAttribute("readonly");
    await expect(topInputs.nth(0)).toHaveValue("1");
    await expect(topInputs.nth(1)).toHaveValue("2");
    await expect(topInputs.nth(2)).toHaveValue("3");

    const bottomInputs = page
      .locator("#bottomLabelsContainer")
      .locator('input[type="text"]');
    await expect(bottomInputs.nth(0)).not.toHaveAttribute("readonly");
    await expect(bottomInputs.nth(0)).toHaveValue("1");
    await expect(bottomInputs.nth(1)).toHaveValue("2");
    await expect(bottomInputs.nth(2)).toHaveValue("3");
  });
});
