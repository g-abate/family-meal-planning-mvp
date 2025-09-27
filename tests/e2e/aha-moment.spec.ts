import { test, expect } from '@playwright/test';

test.describe('Aha Moment - Under 2 Minutes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete wizard and generate meal plan in under 2 minutes', async ({
    page,
  }) => {
    const startTime = Date.now();

    // This test will be implemented once the wizard components are built
    // The goal is to complete the entire flow in under 2 minutes
    // For now, just verify the app loads quickly
    await expect(page).toHaveTitle(/Family Meal Planning MVP/);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Ensure the app loads quickly (under 2 seconds for now)
    expect(duration).toBeLessThan(2000);
  });

  test('should have fast initial page load', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await expect(page).toHaveTitle(/Family Meal Planning MVP/);

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    // Page should load in under 1 second
    expect(loadTime).toBeLessThan(1000);
  });
});
