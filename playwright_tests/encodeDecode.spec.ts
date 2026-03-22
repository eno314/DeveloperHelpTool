import { expect, test } from "@playwright/test";

test.describe("Encode And Decode Tool", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the page
    await page.goto(
      "http://localhost:8000/DeveloperHelpTool/encodeDecode/",
    );
  });

  test("should format URL by default", async ({ page }) => {
    // Check if URL is selected in the combobox initially
    await expect(page.locator("#modeSelect")).toHaveValue("URL");
  });

  test("should encode URL with multibyte query parameters", async ({ page }) => {
    const urlToEncode = "https://example.com/search?q1=テスト&p2=エンコード";
    const expectedEncodedUrl = encodeURIComponent(urlToEncode);

    await page.locator("#encodingTextarea").fill(urlToEncode);
    await page.locator("#encodeBtn").click();

    await expect(page.locator("#decodingTextarea")).toHaveValue(
      expectedEncodedUrl,
    );
  });

  test("should decode URL with multibyte query parameters", async ({ page }) => {
    const urlToDecode = "https://example.com/search?q1=テスト&p2=デコード";
    const encodedUrlToDecode = encodeURIComponent(urlToDecode);

    await page.locator("#decodingTextarea").fill(encodedUrlToDecode);
    await page.locator("#decodeBtn").click();

    await expect(page.locator("#encodingTextarea")).toHaveValue(urlToDecode);
  });

  test("should switch to Base64 format correctly", async ({ page }) => {
    await page.locator("#modeSelect").selectOption("Base64");

    await expect(page.locator("#encodingTextareaLabel")).toHaveText(
      "Please input text you'd like to encode. (UTF-8)",
    );
    await expect(page.locator("#encodingTextarea")).toHaveAttribute(
      "placeholder",
      "UTF-8",
    );
  });

  test("should encode text with multibyte parameters in Base64 mode", async ({ page }) => {
    await page.locator("#modeSelect").selectOption("Base64");

    const textToEncode = "あいうえお UTF-8 123";
    const expectedEncodedText = "44GC44GE44GG44GI44GKIFVURi04IDEyMw==";

    await page.locator("#encodingTextarea").fill(textToEncode);
    await page.locator("#encodeBtn").click();

    await expect(page.locator("#decodingTextarea")).toHaveValue(
      expectedEncodedText,
    );
  });

  test("should decode Base64 string to multibyte text in Base64 mode", async ({ page }) => {
    await page.locator("#modeSelect").selectOption("Base64");

    const textToDecode = "あいうえお UTF-8 123";
    const encodedTextToDecode = "44GC44GE44GG44GI44GKIFVURi04IDEyMw==";

    await page.locator("#decodingTextarea").fill(encodedTextToDecode);
    await page.locator("#decodeBtn").click();

    await expect(page.locator("#encodingTextarea")).toHaveValue(textToDecode);
  });

  test("should show file upload inputs in JSON mode", async ({ page }) => {
    await page.locator("#modeSelect").selectOption("JSON");

    await expect(page.locator("#leftUploadContainer")).not.toHaveClass(
      /d-none/,
    );
    await expect(page.locator("#rightUploadContainer")).not.toHaveClass(
      /d-none/,
    );
  });

  test("should encode (minify) formatted JSON string", async ({ page }) => {
    await page.locator("#modeSelect").selectOption("JSON");

    const formattedJson = '{\n  "key": "value",\n  "num": 123\n}';
    const minifiedJson = '{"key":"value","num":123}';

    await page.locator("#encodingTextarea").fill(formattedJson);
    await page.locator("#encodeBtn").click();

    await expect(page.locator("#decodingTextarea")).toHaveValue(minifiedJson);
  });

  test("should decode (format) minified JSON string", async ({ page }) => {
    await page.locator("#modeSelect").selectOption("JSON");

    const minifiedJson = '{"key":"value","num":123}';
    const formattedJson = '{\n  "key": "value",\n  "num": 123\n}';

    await page.locator("#decodingTextarea").fill(minifiedJson);
    await page.locator("#decodeBtn").click();

    await expect(page.locator("#encodingTextarea")).toHaveValue(formattedJson);
  });
});
