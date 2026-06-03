import { test, expect } from '@playwright/test';

test('dev server serves the extension page', async ({ page }) => {
  // The dev server serves newtab.html at the root when using @crxjs/vite-plugin
  const response = await page.goto('/');
  // Verify we get a response (the page may show a placeholder before extension loads)
  expect(response?.status()).toBe(200);
});

test('page has root element for React mounting', async ({ page }) => {
  await page.goto('/');
  // Verify the React mount point exists
  await expect(page.locator('#root')).toBeVisible();
});
