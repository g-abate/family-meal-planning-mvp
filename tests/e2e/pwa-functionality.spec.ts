import { test, expect } from '@playwright/test';

test.describe('PWA Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have PWA manifest', async ({ page }) => {
    const manifest = await page.evaluate(() => {
      const manifestLink = document.querySelector('link[rel="manifest"]');
      return manifestLink ? manifestLink.getAttribute('href') : null;
    });

    expect(manifest).toBe('/manifest.json');
  });

  test('should have proper PWA meta tags', async ({ page }) => {
    const themeColor = await page.getAttribute(
      'meta[name="theme-color"]',
      'content'
    );
    const appleMobileWebAppCapable = await page.getAttribute(
      'meta[name="apple-mobile-web-app-capable"]',
      'content'
    );
    const appleMobileWebAppTitle = await page.getAttribute(
      'meta[name="apple-mobile-web-app-title"]',
      'content'
    );

    expect(themeColor).toBe('#ffffff');
    expect(appleMobileWebAppCapable).toBe('yes');
    expect(appleMobileWebAppTitle).toBe('MealPrep');
  });

  test('should register service worker', async ({ page }) => {
    // Wait for service worker to be registered
    await page.waitForFunction(() => {
      return 'serviceWorker' in navigator;
    });

    // Wait for the service worker to be registered (with timeout)
    await page.waitForFunction(
      async () => {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          return !!registration;
        }
        return false;
      },
      { timeout: 10000 }
    );

    const swRegistered = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        return !!registration;
      }
      return false;
    });

    expect(swRegistered).toBe(true);
  });

  test('should have PWA icons', async ({ page }) => {
    const appleTouchIcon = await page.getAttribute(
      'link[rel="apple-touch-icon"]',
      'href'
    );
    const favicon32 = await page.getAttribute(
      'link[rel="icon"][sizes="32x32"]',
      'href'
    );
    const favicon16 = await page.getAttribute(
      'link[rel="icon"][sizes="16x16"]',
      'href'
    );

    expect(appleTouchIcon).toBe('/apple-touch-icon.png');
    expect(favicon32).toBe('/favicon-32x32.png');
    expect(favicon16).toBe('/favicon-16x16.png');
  });

  test('should be installable as PWA', async ({ page, context }) => {
    // This test will be more comprehensive once the app is fully built
    // For now, just verify the manifest is valid
    const manifest = await page.evaluate(async () => {
      const response = await fetch('/manifest.json');
      return response.ok;
    });

    expect(manifest).toBe(true);
  });
});
