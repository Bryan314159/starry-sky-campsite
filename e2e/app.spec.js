import { test, expect } from '@playwright/test';

test.describe('SP1 — Page loads', () => {
  test('SP1.1: page returns 200 with root mount point', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('#root')).toBeVisible();
  });
});

test.describe('SP7 — Accessibility', () => {
  test('SP7.1: page loads under reduced motion without errors', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('#root')).toBeVisible();
  });
});
