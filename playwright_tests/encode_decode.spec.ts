import {test, expect} from '@playwright/test';

test.describe('Encode And Decode Tool', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/encodeDecode');
  });

  test('should format URL by default', async ({page}) => {
    // Check if URL is selected in the combobox initially
    await expect(page.getByLabel('Format')).toHaveValue('URL');
  });

  test('should encode URL with multibyte query parameters', async ({page}) => {
    // Encode test data
    const urlToEncode = 'https://example.com/search?q1=テスト&p2=エンコード';
    const expectedEncodedUrl = encodeURIComponent(urlToEncode);

    // Fill the textarea associated with "Please input text you'd like to encode."
    await page
      .getByLabel("Please input text you'd like to encode.")
      .fill(urlToEncode);

    // Click the encode button
    await page.getByRole('button', {name: 'Encoding ▶'}).click();

    // Verify the output in the decode textarea
    await expect(
      page.getByLabel("Please input text you'd like to decode."),
    ).toHaveValue(expectedEncodedUrl);
  });

  test('should decode URL with multibyte query parameters', async ({page}) => {
    // Decode test data
    const urlToDecode = 'https://example.com/search?q1=テスト&p2=デコード';
    const encodedUrlToDecode = encodeURIComponent(urlToDecode);

    // Fill the textarea associated with "Please input text you'd like to decode."
    await page
      .getByLabel("Please input text you'd like to decode.")
      .fill(encodedUrlToDecode);

    // Click the decode button
    await page.getByRole('button', {name: '◀ Decoding'}).click();

    // Verify the output in the encode textarea
    await expect(
      page.getByLabel("Please input text you'd like to encode."),
    ).toHaveValue(urlToDecode);
  });

  test('should switch to Base64 format correctly', async ({page}) => {
    // Change format to Base64
    await page.getByLabel('Format').selectOption('Base64');
    // Check if text elements update correctly
    await expect(
      page.getByLabel("Please input text you'd like to encode. (UTF-8)"),
    ).toBeVisible();
    await expect(page.getByRole('button', {name: 'Encoding ▶'})).toBeVisible();
  });

  test('should encode text with multibyte parameters in Base64 mode', async ({
    page,
  }) => {
    await page.getByLabel('Format').selectOption('Base64');

    // Encode test data
    const textToEncode = 'あいうえお UTF-8 123';
    // Manually encoded in UTF-8 Base64
    const expectedEncodedText = '44GC44GE44GG44GI44GKIFVURi04IDEyMw==';

    // Fill the textarea associated with "Please input text you'd like to encode. (UTF-8)"
    await page
      .getByLabel("Please input text you'd like to encode. (UTF-8)")
      .fill(textToEncode);

    // Click the encode button
    await page.getByRole('button', {name: 'Encoding ▶'}).click();

    // Verify the output in the decode textarea
    await expect(
      page.getByLabel("Please input text you'd like to decode."),
    ).toHaveValue(expectedEncodedText);
  });

  test('should decode Base64 string to multibyte text in Base64 mode', async ({
    page,
  }) => {
    await page.getByLabel('Format').selectOption('Base64');

    // Decode test data
    const textToDecode = 'あいうえお UTF-8 123';
    // Manually encoded in UTF-8 Base64
    const encodedTextToDecode = '44GC44GE44GG44GI44GKIFVURi04IDEyMw==';

    // Fill the textarea associated with "Please input text you'd like to decode."
    await page
      .getByLabel("Please input text you'd like to decode.")
      .fill(encodedTextToDecode);

    // Click the decode button
    await page.getByRole('button', {name: '◀ Decoding'}).click();

    // Verify the output in the encode textarea
    await expect(
      page.getByLabel("Please input text you'd like to encode. (UTF-8)"),
    ).toHaveValue(textToDecode);
  });

  test('should show file upload inputs in JSON mode', async ({page}) => {
    // Change format to JSON
    await page.getByLabel('Format').selectOption('JSON');

    // Verify file upload inputs are visible
    await expect(page.getByLabel('Upload File to Encode')).toBeVisible();
    await expect(page.getByLabel('Upload File to Decode')).toBeVisible();
  });

  test('should encode (minify) formatted JSON string', async ({page}) => {
    // Change format to JSON
    await page.getByLabel('Format').selectOption('JSON');

    const formattedJson = '{\n  "key": "value",\n  "num": 123\n}';
    const minifiedJson = '{"key":"value","num":123}';

    // Fill the textarea associated with "Please input text you'd like to encode."
    await page
      .getByLabel("Please input text you'd like to encode.")
      .fill(formattedJson);

    // Click the encode button
    await page.getByRole('button', {name: 'Encoding ▶'}).click();

    // Verify the output in the decode textarea
    await expect(
      page.getByLabel("Please input text you'd like to decode."),
    ).toHaveValue(minifiedJson);
  });

  test('should decode (format) minified JSON string', async ({page}) => {
    // Change format to JSON
    await page.getByLabel('Format').selectOption('JSON');

    const minifiedJson = '{"key":"value","num":123}';
    const formattedJson = '{\n  "key": "value",\n  "num": 123\n}';

    // Fill the textarea associated with "Please input text you'd like to decode."
    await page
      .getByLabel("Please input text you'd like to decode.")
      .fill(minifiedJson);

    // Click the decode button
    await page.getByRole('button', {name: '◀ Decoding'}).click();

    // Verify the output in the encode textarea
    await expect(
      page.getByLabel("Please input text you'd like to encode."),
    ).toHaveValue(formattedJson);
  });
});
