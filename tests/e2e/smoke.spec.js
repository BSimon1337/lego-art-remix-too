const { test, expect } = require("@playwright/test");

test("loads app shell and key controls", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Lego Art Remix/i);
  await expect(page.locator("#input-image-selector")).toBeVisible();
  await expect(page.locator("#dark-mode-toggle")).toBeVisible();
});
