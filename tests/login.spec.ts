import { test, expect } from "@playwright/test";

test.beforeEach("Open page", async ({ page }) => {
  await page.goto("https://ezares-dev.ezcloudi.com/invoice-created");
});

test("Login with valid credentials", async ({ page }) => {
  const email = process.env.LOGIN_INFO_USR || "admin";
  const password = process.env.LOGIN_INFO_PSW || "ezcloud@123";
  await page.getByRole("textbox", { name: "Username" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Login", exact: true }).click();

  await expect(page.locator(".nav-header")).toBeVisible();
});
