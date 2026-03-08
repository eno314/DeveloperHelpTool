import {test, expect} from '@playwright/test';

test.describe('Url Encode And Decode Tool', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/url/encode');
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
    await page.getByRole('button', {name: '▼ Apply URL Encoding'}).click();

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
    await page.getByRole('button', {name: '▲ Apply URL Decoding'}).click();

    // Verify the output in the encode textarea
    await expect(
      page.getByLabel("Please input text you'd like to encode."),
    ).toHaveValue(urlToDecode);
  });
});
