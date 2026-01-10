import { test, expect } from "@playwright/test";

test.beforeEach("Open page", async ({ page }) => {
  await page.goto("https://id.ezcloud.vn/Account/Register");
});

test.fixme("Password field click and blur", async ({ page }) => {
  await page.locator("#password").click();

  await expect(page.locator(".popover-header")).toHaveText("Password rules");

  await page.getByLabel("Password rules").evaluate((el) => el.blur());

  await expect(page.locator(".popover-header")).toBeVisible();
  await page.locator("#password").evaluate((el) => el.blur());
  await expect(page.locator(".popover-header")).not.toBeVisible();
});

test("Account already exists", async ({ page }) => {
  await page.locator("#Email").fill("dzung@gmail.com");
  await page.getByLabel("Password rules").fill("dungvn@2");
  await page.locator("#ConfirmPassword").fill("dungvn@1");
  await page.locator("#terms").check();
  await page.locator("button[type=submit]").click();
  await expect(page.getByText("Error Username 'dzung@gmail.")).toBeVisible();
});
