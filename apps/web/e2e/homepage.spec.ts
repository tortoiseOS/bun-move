import { test, expect } from '@playwright/test';

test.describe('TortoiseOS Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Check that we're on the right page
    expect(page.url()).toContain('localhost:3000');

    // Wait for body to be visible
    await page.waitForSelector('body', { timeout: 10000 });

    // Check for successful load (no error page)
    const body = await page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should display TortoiseOS branding', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Wait for content to be rendered
    await page.waitForSelector('h1', { timeout: 10000 });

    // Check for TortoiseOS text in headings
    const headings = await page.locator('h1').allTextContents();
    const hasTortoiseOS = headings.some(text => text.includes('TortoiseOS'));

    expect(hasTortoiseOS).toBe(true);

    // Verify the emoji is there
    const firstHeading = await page.locator('h1').first().textContent();
    expect(firstHeading).toContain('🐢');
  });

  test('should display product information', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Wait for the products section to load
    await page.waitForSelector('body', { timeout: 10000 });

    // Check that product-related text is visible
    const pageContent = await page.textContent('body');

    // Should mention TortoiseOS products
    const hasProducts =
      pageContent?.includes('TortoiseSwap') ||
      pageContent?.includes('TortoiseVault') ||
      pageContent?.includes('TortoiseUSD') ||
      pageContent?.includes('AI-powered') ||
      pageContent?.includes('products');

    expect(hasProducts).toBe(true);
  });

  test('should display wallet connection UI', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Wait for React to hydrate
    await page.waitForSelector('button', { timeout: 10000 });

    // Check that connect wallet button exists
    const connectButton = await page.getByRole('button', { name: /connect wallet/i });
    await expect(connectButton).toBeVisible({ timeout: 10000 });
  });

  test('should have proper page metadata', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Wait a moment for the page to fully render
    await page.waitForLoadState('domcontentloaded');

    // Check page title contains TortoiseOS
    const title = await page.title();
    expect(title).toContain('TortoiseOS');

    // Check viewport meta tag exists
    const viewportMeta = await page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveCount(1);
  });
});
