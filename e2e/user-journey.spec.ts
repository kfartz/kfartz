import { expect, test } from "@playwright/test";
import {
  clearDatabase,
  initPayloadForTest,
  seedBaselineData,
  seedTestUser,
} from "./test-utils";

test.describe("Data-entry user journey", () => {
  test.beforeAll(async () => {
    // We initialize Payload from local config inside Playwright setup
    // This connects directly to the DB and clears/seeds it for the E2E tests
    await initPayloadForTest();
    await clearDatabase();
    await seedTestUser();
    await seedBaselineData();
  });

  test("can log in, view tables, and add new crystal data", async ({
    page,
  }) => {
    // 1. Log in
    await page.goto("/login");
    await page.getByLabel("Email").fill("e2e@example.com");
    await page.getByLabel("Password", { exact: true }).fill("password123");
    await page.getByRole("button", { name: /Sign in/i }).click();

    // Verify successful login
    // After login, it should redirect to the default table (e.g. /crystals)
    // Next.js Turbopack compilation on first hit might take a while
    await expect(page).toHaveURL(/\/crystals/, { timeout: 15000 });

    // Navigate to Crystals table (redundant but safe)
    await page.goto("/crystals");

    await page.waitForTimeout(1000); // Wait a bit for potential data loading

    // 2. Navigate and view baseline data
    // Assuming the table renders the crystal we seeded
    await expect(page.getByText("E2E Crystal")).toBeVisible();
    await expect(page.getByText("blue")).toBeVisible(); // Color seeded
    await expect(page.getByText("prism")).toBeVisible(); // Shape seeded

    // 3. Open insert form / dialog
    // Click the user dropdown
    await page.getByRole("button", { name: /e2e/i }).click();
    // Click the insert menu item
    await page.getByRole("menuitem", { name: /Insert/i }).click();

    // Verify we navigated to the insert page
    await expect(page).toHaveURL(/\/crystals\/insert/, { timeout: 15000 });

    // 4. Fill out the insert form for a new Crystal
    // E2E Test Crystal
    await page.getByLabel("source").fill("Volcanic Rock");
    await page.getByLabel("name").fill("Obsidian Fragment");

    // Dimensions
    await page.getByLabel("max").fill("20");
    await page.getByLabel("mid").fill("15");
    await page.getByLabel("min").fill("5");

    // Color (c is the only required color)
    await page.locator('button[id="color.c"]').click();
    await page.getByRole("option", { name: "black" }).click();

    // Shape
    await page.locator('button[id="shape"]').click();
    await page.getByRole("option", { name: "irregular" }).click();

    // Submit
    await page.getByRole("button", { name: /Insert Record/i }).click();

    // It should alert on success and we accept it
    page.on("dialog", (dialog) => dialog.accept());

    // 5. Verify the new data is saved and appears in the table
    // It should dismiss the dialog and update the table
    await expect(page).toHaveURL(/\/crystals$/, { timeout: 15000 });
    await expect(page.getByText("Obsidian Fragment")).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText("Volcanic Rock")).toBeVisible();
  });
});
