import {test, expect} from '@playwright/test';

test.describe('Index Page Navigation Tests', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
  });

  const linksToTest = [
    {
      text: 'JSON Parse Tool',
      expectedPath: '/json/parse',
      expectedTitle: 'Developer Help Tool - JSON Parse Tool',
    },
    {
      text: 'String Replace Tool',
      expectedPath: '/string/replace',
      expectedTitle: 'Developer Help Tool - String Replace Tool',
    },
    {
      text: 'Url Encode And Decode Tool',
      expectedPath: '/url/encode',
      expectedTitle: 'Developer Help Tool - Url Encode And Decode Tool',
    },
    {
      text: 'Url Parse Tool',
      expectedPath: '/url/parse',
      expectedTitle: 'Developer Help Tool - Url Parse Tool',
    },
    {
      text: 'Amidakuji Tool',
      expectedPath: '/amidakuji',
      expectedTitle: 'Developer Help Tool - Amidakuji Tool',
    },
    {
      text: 'Base64 Encode And Decode Tool',
      expectedPath: '/base64/encode',
      expectedTitle: 'Developer Help Tool - Base64 Encode And Decode Tool',
    },
    {
      text: 'Curl Builder Tool',
      expectedPath: '/curl/builder',
      expectedTitle: 'Developer Help Tool - Curl Builder Tool',
    },
  ];

  for (const link of linksToTest) {
    test(`should navigate to ${link.text} and verify title`, async ({page}) => {
      // Find the link by text and click it
      await page.click(`text=${link.text}`);

      // Wait for the URL to change
      await expect(page).toHaveURL(new RegExp(link.expectedPath));

      // Verify the page title
      await expect(page).toHaveTitle(link.expectedTitle);
    });
  }
});
