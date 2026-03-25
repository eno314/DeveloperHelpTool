import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/DeveloperHelpTool/string/count/");
  await expect(page).toHaveTitle(/Developer Help Tool/);
});

test("count simple string", async ({ page }) => {
  await page.goto("/DeveloperHelpTool/string/count/");

  await page.fill("#inputTextarea", "hello");

  await expect(page.locator("#charCountDisplay")).toHaveText("5");
  await expect(page.locator("#byteCountDisplay")).toHaveText("5");
});

test("count multi-byte string", async ({ page }) => {
  await page.goto("/DeveloperHelpTool/string/count/");

  await page.fill("#inputTextarea", "こんにちは");

  await expect(page.locator("#charCountDisplay")).toHaveText("5");
  await expect(page.locator("#byteCountDisplay")).toHaveText("15");
});

test("count emojis", async ({ page }) => {
  await page.goto("/DeveloperHelpTool/string/count/");

  await page.fill("#inputTextarea", "🍎");

  // A standard emoji like Apple is often 2 surrogate code units in JS length
  await expect(page.locator("#charCountDisplay")).toHaveText("2");
  await expect(page.locator("#byteCountDisplay")).toHaveText("4");
});

test("count empty string", async ({ page }) => {
  await page.goto("/DeveloperHelpTool/string/count/");

  await page.fill("#inputTextarea", "");

  await expect(page.locator("#charCountDisplay")).toHaveText("0");
  await expect(page.locator("#byteCountDisplay")).toHaveText("0");
});
