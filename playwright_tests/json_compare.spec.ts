import {test, expect} from '@playwright/test';

test('JSON Compare Tool correctly parses and compares JSON strings', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/json/compare');

  await expect(page).toHaveTitle('Developer Help Tool - JSON Compare Tool');
  await expect(
    page.getByRole('heading', {name: 'JSON Compare Tool'}),
  ).toBeVisible();

  const leftTextarea = page.locator('textarea').nth(0);
  const rightTextarea = page.locator('textarea').nth(1);
  const compareButton = page.getByRole('button', {name: 'Compare'});

  // Test error for invalid JSON
  await leftTextarea.fill('invalid json');
  await compareButton.click();
  await expect(page.getByText('Left JSON is invalid.')).toBeVisible();

  // Test successful diff comparison
  const validJsonLeft = '{"name": "John", "age": 30}';
  const validJsonRight = '{"name": "John", "age": 31, "city": "New York"}';

  await leftTextarea.fill(validJsonLeft);
  await rightTextarea.fill(validJsonRight);
  await compareButton.click();

  await expect(page.getByText('Left Result')).toBeVisible();
  await expect(page.getByText('Right Result')).toBeVisible();

  // "age": 30 should be present and marked as removed on the left side
  const leftRemovedSpan = page.locator('span[class*="removed"]');
  await expect(leftRemovedSpan).toContainText('"age": 30');

  // "age": 31 and "city": "New York" should be present and marked as added on the right side
  const rightAddedSpan = page.locator('span[class*="added"]');
  await expect(rightAddedSpan).toContainText('"age": 31');
  await expect(rightAddedSpan).toContainText('"city": "New York"');
});

test('JSON Compare Tool correctly parses and compares from uploaded JSON files', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/json/compare');

  const validJsonLeft = '{"name": "John", "age": 30}';
  const validJsonRight = '{"name": "John", "age": 31, "city": "New York"}';

  const leftFileChooserPromise = page.waitForEvent('filechooser');
  await page.getByLabel('Upload Left JSON file').click();
  const leftFileChooser = await leftFileChooserPromise;
  await leftFileChooser.setFiles({
    name: 'left.json',
    mimeType: 'application/json',
    buffer: Buffer.from(validJsonLeft),
  });

  const rightFileChooserPromise = page.waitForEvent('filechooser');
  await page.getByLabel('Upload Right JSON file').click();
  const rightFileChooser = await rightFileChooserPromise;
  await rightFileChooser.setFiles({
    name: 'right.json',
    mimeType: 'application/json',
    buffer: Buffer.from(validJsonRight),
  });

  const leftTextarea = page.locator('textarea').nth(0);
  const rightTextarea = page.locator('textarea').nth(1);
  await expect(leftTextarea).toHaveValue(validJsonLeft);
  await expect(rightTextarea).toHaveValue(validJsonRight);

  const compareButton = page.getByRole('button', {name: 'Compare'});
  await compareButton.click();

  await expect(page.getByText('Left Result')).toBeVisible();
  await expect(page.getByText('Right Result')).toBeVisible();
});
