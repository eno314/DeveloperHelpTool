import {test, expect} from '@playwright/test';

test.describe('Timestamp Tool', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/timestamp');
  });

  test('should display the Timestamp Tool page correctly', async ({page}) => {
    // Check main title
    await expect(page.locator('h1')).toContainText('Developer Help Tool');

    // Check subtitle
    await expect(page.locator('h2').first()).toContainText('Timestamp Tool');

    // Check Unix Timestamp section
    await expect(
      page.locator('text=Current Unix Timestamp (Seconds)'),
    ).toBeVisible();

    // Wait for client-side rendering to complete and the unix timestamp to show up
    const timestampValue = page.locator('.card-body h2.text-monospace');
    await expect(timestampValue).toBeVisible();

    // Validate it's a number
    const text = await timestampValue.textContent();
    expect(Number(text)).not.toBeNaN();
    expect(Number(text)).toBeGreaterThan(0);

    // Check Current Time section
    await expect(page.locator('text=Current Time')).toBeVisible();

    // Check table headers
    await expect(page.locator('text=Timezone / City')).toBeVisible();
    await expect(page.locator('text=Time (YYYY-MM-DD HH:mm:ss)')).toBeVisible();

    // Check specific rows
    await expect(page.locator('text=Japan (JST)')).toBeVisible();
    await expect(page.locator('text=UTC (GMT)')).toBeVisible();
    await expect(page.locator('text=New York (EST/EDT)')).toBeVisible();
    await expect(page.locator('text=London (GMT/BST)')).toBeVisible();
    await expect(page.locator('text=Local Time')).toBeVisible();
  });

  test('should verify the copy button functionality', async ({
    page,
    context,
  }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const copyButton = page.getByRole('button', {name: 'Copy timestamp'});
    await expect(copyButton).toBeVisible();

    // Click the copy button
    await copyButton.click();

    // Check if the button text changes to "Copied!"
    await expect(copyButton).toContainText('Copied!');

    // Check clipboard content
    const clipboardText = await page.evaluate('navigator.clipboard.readText()');

    // Check that what was copied is a valid number (timestamp)
    expect(Number(clipboardText)).not.toBeNaN();
    expect(Number(clipboardText)).toBeGreaterThan(0);

    // Now test a row copy button
    const copyJstButton = page.getByRole('button', {
      name: 'Copy time for Japan (JST)',
    });
    await expect(copyJstButton).toBeVisible();

    // Click the JST row copy button
    await copyJstButton.click();
    await expect(copyJstButton).toContainText('Copied!');

    // Check clipboard content
    const jstClipboardText = await page.evaluate(
      'navigator.clipboard.readText()',
    );

    // Check that it's a formatted date string matching roughly YYYY-MM-DD HH:mm:ss
    expect(jstClipboardText).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  test('should be accessible from the index page', async ({page}) => {
    await page.goto('/');

    // Click on the Timestamp Tool link
    await page.click('text=Timestamp Tool');

    // Verify that we are on the Timestamp Tool page
    await expect(page).toHaveURL(/.*\/timestamp/);
    await expect(page.locator('h2').first()).toContainText('Timestamp Tool');
  });
});
