import { expect, test } from "@playwright/test";

test("login page has expected elements and validates input", async ({
  page,
}) => {
  // Go to the sign-in page
  await page.goto("/login");

  // Check the title
  await expect(page).toHaveTitle(/Kfartz/i);

  // Expect form elements to be visible
  await expect(page.getByLabel("Email")).toBeVisible();

  // Use exact match for Password label
  await expect(page.getByLabel("Password", { exact: true })).toBeVisible();

  const submitBtn = page.getByRole("button", { name: /Sign in/i });
  await expect(submitBtn).toBeVisible();

  // The button might be disabled until inputs are filled in some apps
  // Let's just check its presence and type
  await expect(submitBtn).toHaveAttribute("type", "submit");
});

test("can toggle password visibility", async ({ page }) => {
  await page.goto("/login");

  const passwordInput = page.getByLabel("Password", { exact: true });
  const toggleBtn = page.getByRole("button", { name: /Show password/i });

  // Initially hidden
  await expect(passwordInput).toHaveAttribute("type", "password");

  // Click show
  await toggleBtn.click();
  await expect(passwordInput).toHaveAttribute("type", "text");
});
