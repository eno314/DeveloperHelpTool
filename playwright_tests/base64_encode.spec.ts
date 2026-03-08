import {test, expect} from '@playwright/test';

test.describe('Base64 Encode And Decode Tool', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/base64/encode');
  });

  test('should encode text with multibyte parameters', async ({page}) => {
    // Encode test data
    const textToEncode = 'あいうえお UTF-8 123';
    // Manually encoded in UTF-8 Base64
    const expectedEncodedText = '44GC44GE44GG44GI44GKIFVURi04IDEyMw==';

    // Fill the textarea associated with "Please input text you'd like to encode. (UTF-8)"
    await page
      .getByLabel("Please input text you'd like to encode. (UTF-8)")
      .fill(textToEncode);

    // Click the encode button
    await page.getByRole('button', {name: '▼ Apply Base64 Encoding'}).click();

    // Verify the output in the decode textarea
    await expect(
      page.getByLabel("Please input text you'd like to decode."),
    ).toHaveValue(expectedEncodedText);
  });

  test('should decode Base64 string to multibyte text', async ({page}) => {
    // Decode test data
    const textToDecode = 'あいうえお UTF-8 123';
    // Manually encoded in UTF-8 Base64
    const encodedTextToDecode = '44GC44GE44GG44GI44GKIFVURi04IDEyMw==';

    // Fill the textarea associated with "Please input text you'd like to decode."
    await page
      .getByLabel("Please input text you'd like to decode.")
      .fill(encodedTextToDecode);

    // Click the decode button
    await page.getByRole('button', {name: '▲ Apply Base64 Decoding'}).click();

    // Verify the output in the encode textarea
    await expect(
      page.getByLabel("Please input text you'd like to encode. (UTF-8)"),
    ).toHaveValue(textToDecode);
  });
});
