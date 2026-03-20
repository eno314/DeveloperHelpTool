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
    await expect(page.locator('text=Local Time')).toBeVisible();
    await expect(page.locator('text=UTC (GMT)')).toBeVisible();
    await expect(page.getByLabel('Select timezone')).toBeVisible();
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
    const copyUtcButton = page.getByRole('button', {
      name: 'Copy time for UTC (GMT)',
    });
    await expect(copyUtcButton).toBeVisible();

    // Click the UTC row copy button
    await copyUtcButton.click();
    await expect(copyUtcButton).toContainText('Copied!');

    // Check clipboard content
    const utcClipboardText = await page.evaluate(
      'navigator.clipboard.readText()',
    );

    // Check that it's a formatted date string matching roughly YYYY-MM-DD HH:mm:ss
    expect(utcClipboardText).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);

    // Test the select timezone copy functionality
    const select = page.getByLabel('Select timezone');
    await select.selectOption('Asia/Tokyo');

    const copySelectedBtn = page.getByRole('button', {
      name: 'Copy time for selected timezone',
    });
    await expect(copySelectedBtn).toBeVisible();
    await copySelectedBtn.click();
    await expect(copySelectedBtn).toContainText('Copied!');
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
