import {test, expect} from '@playwright/test';

test.describe('String Replace Page Tests', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/string/replace');
  });

  test('should successfully replace a substring', async ({page}) => {
    // Fill the original text textarea
    const textareaLabel = "Please input text you'd like to replace.";
    await page.getByLabel(textareaLabel).fill('hello world');

    // Fill the target substring
    await page.locator('input[aria-describedby="targetSubstr"]').fill('world');

    // Fill the new substring
    await page
      .locator('input[aria-describedby="newSubstr"]')
      .fill('playwright');

    // Click the Apply button
    await page.getByRole('button', {name: '▼ Apply'}).click();

    // Verify the result textarea
    const resultTextarea = page.locator('#newTextarea');
    await expect(resultTextarea).toHaveValue('hello playwright');
  });
});
