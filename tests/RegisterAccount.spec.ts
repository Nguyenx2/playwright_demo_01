import { test, expect } from "@playwright/test";

test.beforeEach("Open page", async ({ page }) => {
  await page.goto("https://id.ezcloud.vn/Account/Register");
});

test.describe("Test email field", () => {
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== "passed") {
      const timestamp = new Date().getTime();
      const screenshotPath = `screenshots/RegisterAccount/${testInfo.title}-${timestamp}.png`;
      await page.screenshot({ path: screenshotPath });
    }
  });
  test("Email without @ character", async ({ page }) => {
    await page.locator("#Email").fill("dzung.com");
    await page.locator("#Email").evaluate((element) => element.blur());
    await expect(page.locator("#Email-error")).toBeVisible();
  });

  test("Email without domain", async ({ page }) => {
    await page.locator("#Email").fill("dzung@");
    await page.locator("#Email").evaluate((element) => element.blur());
    await expect(page.locator("#Email-error")).toBeVisible();
  });

  test.fixme("Email without domain extension", async ({ page }) => {
    await page.locator("#Email").fill("dzung@gmail");
    await page.locator("#Email").evaluate((element) => element.blur());
    await expect(page.locator("#Email-error")).toBeVisible();
  });
});

test.fixme("Password field click and blur", async ({ page }) => {
  await page.locator("#password").click();

  await expect(page.locator(".popover-header")).toHaveText("Password rules");

  await page.getByLabel("Password rules").evaluate((el) => el.blur());

  await expect(page.locator(".popover-header")).toBeVisible();
  await page.locator("#password").evaluate((el) => el.blur());
  await expect(page.locator(".popover-header")).not.toBeVisible();
});

// Use Xpath to locate elements
test("Check checkbox for terms and conditions", async ({ page }) => {
  await page.locator("//input[@id='terms']").uncheck();
  await page.locator("//button[normalize-space()='Register']").click();
  await expect(
    page.locator("//h5[normalize-space()='Please accept terms and conditions']")
  ).toBeVisible();
});

test("See terms and conditions", async ({ page }) => {
  await page.locator("a[onclick='ShowTermsAndConditions()']").click();
  await expect(page.locator("#myModal2 .modal-title")).toBeVisible();
});

test("Email field and password field are required", async ({ page }) => {
  await page.locator("#terms").check();
  await page.locator("button[type=submit]").click();
  await expect(page.locator("#Email-error")).toBeVisible();
  await expect(page.locator("#password-error")).toBeVisible();
});

test.describe("Test register account", () => {
  test.beforeEach("Fill form", async ({ page }) => {
    await page.locator("#Email").fill("dzung@gmail.com");
    await page.locator("#terms").check();
  });

  test("Password contains at least 8 characters", async ({ page }) => {
    await page.getByLabel("Password rules").fill("dungvn1");
    await page.locator("#ConfirmPassword").fill("dungvn1");
    await page.locator("button[type=submit]").click();
    await expect(page.getByText("Passwords must be at least 8")).toBeVisible();
  });

  test.fixme("Password contains at least one alphabet", async ({ page }) => {
    await page.getByLabel("Password rules").fill("12345678");
    await page.locator("#ConfirmPassword").fill("12345678");
    await page.locator("button[type=submit]").click();
    await expect(
      page.getByText("Passwords must be contained at least one alphabet ")
    ).toBeVisible();
  });

  test("Password contain at least one numeric", async ({ page }) => {
    await page.getByLabel("Password rules").fill("aaaaaaaa");
    await page.locator("#ConfirmPassword").fill("aaaaaaaa");
    await page.locator("button[type=submit]").click();
    await expect(page.getByText("Passwords must have at least")).toBeVisible();
  });
});

test("Account already exists", async ({ page }) => {
  await page.locator("#Email").fill("dzung@gmail.com");
  await page.getByLabel("Password rules").fill("dungvn@1");
  await page.locator("#ConfirmPassword").fill("dungvn@1");
  await page.locator("#terms").check();
  await page.locator("button[type=submit]").click();
  await expect(page.getByText("Error Username 'dzung@gmail.")).toBeVisible();
});
