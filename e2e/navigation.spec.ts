import { expect, test } from "@playwright/test";

test("can navigate between tables", async ({ page }) => {
  await page.goto("/login");

  // Basic login if needed (assuming the app might be open or we can just go to /crystals)
  // We'll just go directly to /crystals. Next.js might redirect if auth is strictly enforced.
  await page.goto("/crystals");

  // If redirected to login, handle it
  if (page.url().includes("/login")) {
    // Fill in a test user if auth is required for tests
    // Using a stub for now, as we don't have a test user seeded yet
    test.skip();
    return;
  }

  // Check that the crystals page is loaded
  await expect(page).toHaveTitle(/Kfartz/i);

  // Use the table switcher
  // Cmd+K to open
  await page.keyboard.press("Meta+k");

  // Wait for dialog
  await expect(page.getByText("Table picker")).toBeVisible();

  // Search for publications
  await page.getByPlaceholder("Search tables...").fill("pub");

  // Click the result
  await page.getByText("publications").click();

  // Should navigate to publications
  await expect(page).toHaveURL(/.*\/publications/);
});
