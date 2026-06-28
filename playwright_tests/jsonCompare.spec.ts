import { expect, test } from "@playwright/test";
import { Buffer } from "node:buffer";

test("JSON Compare Tool correctly parses and compares JSON strings", async ({ page }) => {
  await page.goto(
    "http://localhost:8000/DeveloperHelpTool/json/compare/",
  );

  await expect(page).toHaveTitle("Developer Help Tool - JSON Compare Tool");
  await expect(
    page.getByRole("heading", {
      name: "Developer Help Tool - JSON Compare Tool",
    }),
  ).toBeVisible();

  const leftTextarea = page.locator("textarea").nth(0);
  const rightTextarea = page.locator("textarea").nth(1);
  const compareButton = page.getByRole("button", { name: "Compare" });

  // Test error for invalid JSON
  await leftTextarea.fill("invalid json");
  await compareButton.click();
  await expect(page.getByText("Left JSON is invalid.")).toBeVisible();

  // Test successful diff comparison
  const validJsonLeft = '{"name": "John", "age": 30}';
  const validJsonRight = '{"name": "John", "age": 31, "city": "New York"}';

  await leftTextarea.fill(validJsonLeft);
  await rightTextarea.fill(validJsonRight);
  await compareButton.click();

  await expect(page.getByText("Left Result")).toBeVisible();
  await expect(page.getByText("Right Result")).toBeVisible();

  // Status alert should show "different elements"
  const statusAlert = page.locator("#compareStatusAlert");
  await expect(statusAlert).toBeVisible();
  await expect(statusAlert).toContainText("要素の相違");

  // "age": 30 should be present and marked as removed on the left side
  const leftRemovedSpan = page.locator("span.removed");
  await expect(leftRemovedSpan).toContainText('"age": 30');

  // "age": 31 and "city": "New York" should be present and marked as added on the right side
  const rightAddedSpan = page.locator("span.added");
  await expect(rightAddedSpan).toContainText('"age": 31');
  await expect(rightAddedSpan).toContainText('"city": "New York"');
});

test("JSON Compare Tool shows exact match status for identical JSON strings", async ({ page }) => {
  await page.goto(
    "http://localhost:8000/DeveloperHelpTool/json/compare/",
  );

  const leftTextarea = page.locator("textarea").nth(0);
  const rightTextarea = page.locator("textarea").nth(1);
  const compareButton = page.getByRole("button", { name: "Compare" });

  await leftTextarea.fill('{"a": 1, "b": 2}');
  await rightTextarea.fill('{"a": 1, "b": 2}');
  await compareButton.click();

  const statusAlert = page.locator("#compareStatusAlert");
  await expect(statusAlert).toBeVisible();
  await expect(statusAlert).toContainText("完全一致");
});

test("JSON Compare Tool shows key order differs status when only key order is different", async ({ page }) => {
  await page.goto(
    "http://localhost:8000/DeveloperHelpTool/json/compare/",
  );

  const leftTextarea = page.locator("textarea").nth(0);
  const rightTextarea = page.locator("textarea").nth(1);
  const compareButton = page.getByRole("button", { name: "Compare" });

  // Same elements but different key order
  await leftTextarea.fill('{"b": 2, "a": 1}');
  await rightTextarea.fill('{"a": 1, "b": 2}');
  await compareButton.click();

  const statusAlert = page.locator("#compareStatusAlert");
  await expect(statusAlert).toBeVisible();
  await expect(statusAlert).toContainText("キー順序のみ相違");

  // Diff should still show differences (raw input is compared)
  await expect(page.locator("span.removed")).toBeVisible();
});

test("JSON Compare Tool correctly parses and compares from uploaded JSON files", async ({ page }) => {
  await page.goto(
    "http://localhost:8000/DeveloperHelpTool/json/compare/",
  );

  const validJsonLeft = '{"name": "John", "age": 30}';
  const validJsonRight = '{"name": "John", "age": 31, "city": "New York"}';

  const leftFileChooserPromise = page.waitForEvent("filechooser");
  await page.getByLabel("Upload Left JSON file").click();
  const leftFileChooser = await leftFileChooserPromise;
  await leftFileChooser.setFiles({
    name: "left.json",
    mimeType: "application/json",
    buffer: Buffer.from(validJsonLeft),
  });

  const rightFileChooserPromise = page.waitForEvent("filechooser");
  await page.getByLabel("Upload Right JSON file").click();
  const rightFileChooser = await rightFileChooserPromise;
  await rightFileChooser.setFiles({
    name: "right.json",
    mimeType: "application/json",
    buffer: Buffer.from(validJsonRight),
  });

  const leftTextarea = page.locator("textarea").nth(0);
  const rightTextarea = page.locator("textarea").nth(1);
  await expect(leftTextarea).toHaveValue(validJsonLeft);
  await expect(rightTextarea).toHaveValue(validJsonRight);

  const compareButton = page.getByRole("button", { name: "Compare" });
  await compareButton.click();

  await expect(page.getByText("Left Result")).toBeVisible();
  await expect(page.getByText("Right Result")).toBeVisible();

  // Should show "different elements" since age differs
  const statusAlert = page.locator("#compareStatusAlert");
  await expect(statusAlert).toBeVisible();
  await expect(statusAlert).toContainText("要素の相違");
});
