import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { InventoryPage } from "../pages/inventoryPage";

const VALID_USER = "standard_user";
const VALID_PASS = "secret_sauce";

/* 
All tests passed in a reasonable time frame, with no flakiness observed. 
(79 seconds on average for the whole suite, with 37 seconds for happy paths, 
20 seconds for error states and 22 seconds for logout tests)
*/

//Happy path tests, all passed in 37 seconds on average
test.describe("Login", () => {
  //Happy path tests
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("Login elements are being displayed", async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test("Accepted credentials hint should be visible", async ({ page }) => {
    await expect(page.locator("#login_credentials")).toBeVisible();
    await expect(page.locator(".login_password")).toBeVisible();
  });

  test("Standard user should redirect to /inventory.html", async ({ page }) => {
    await loginPage.login(VALID_USER, VALID_PASS);
    await expect(page).toHaveURL(/.*inventory/);
    await expect(page.getByText("Products")).toBeVisible();
  });

  test('problem_user should login but show broken images', async ({ page }) => {
  await loginPage.login('problem_user', VALID_PASS);
  await expect(page).toHaveURL(/.*inventory/);
  await expect(
    page.locator('.inventory_item').first()
  ).toBeVisible();

  const inventoryPage = new InventoryPage(page);
  const productNames = await inventoryPage.getProductNames();
  const productPrices = await inventoryPage.getProductPrices();

  expect(productNames.length).toBeGreaterThan(0);
  expect(productPrices.length).toBeGreaterThan(0);

  const brokenImages = page.locator(
    '.inventory_item_img img[src*=\"sl-404\"]'
  );

  await expect(brokenImages).toHaveCount(productNames.length);
});

  test('Performance glitch user should login but with a delay', async ({ page }) => {
    const start = Date.now();
    await loginPage.login("performance_glitch_user", VALID_PASS);
    await expect(page).toHaveURL(/.*inventory/);
    const end = Date.now();
    const duration = end - start;
    console.log(`Login took ${duration} ms`);
    expect(duration).toBeGreaterThan(4000); // Assuming the glitch causes a delay of at least 4 seconds
  });

  test('error_user should be able to login', async ({ page }) => {
    await loginPage.login('error_user', VALID_PASS);
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('visual_user should be able to login', async ({ page }) => {
    await loginPage.login('visual_user', VALID_PASS);
    await expect(page).toHaveURL(/.*inventory/);
  });

});

//Unhappy path tests, all passed in 20 seconds on average
test.describe("Error states", () => {
  //Unhappy path tests
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("locked_out_user: should show locked-out error", async () => {
    await loginPage.login("locked_out_user", VALID_PASS);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain("Sorry, this user has been locked out");
  });

  test("Wrong passwords should shor credentials mismatch error", async () => {
    await loginPage.login(VALID_USER, "Wrong_Password");
    const error = await loginPage.getErrorMessage();
    expect(error).toContain("Username and password do not match");
  });

  test("both fields empty should show username-required error", async () => {
    await loginPage.login("", "");
    const error = await loginPage.getErrorMessage();
    expect(error).toContain("Username is required");
  });

  test("unknown username should show credentials mismatch error", async () => {
    await loginPage.login("nouser", VALID_PASS);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain(
      "Username and password do not match any user in this service",
    );
  });
});

//Logout path tests, all passed in 22 seconds on average
test.describe("Logout", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("Should log out and return to login page", async ({ page }) => {
    await loginPage.login(VALID_USER, VALID_PASS);
    await loginPage.logout();
    await expect(page).toHaveURL(/.*saucedemo\.com\/?$/);
    await expect(loginPage.loginButton).toBeVisible();
  });

  test("should not access inventory page after logout", async ({ page }) => {
    await loginPage.login(VALID_USER, VALID_PASS);
    await loginPage.logout();
    await page.goto("https://www.saucedemo.com/inventory.html");
    await expect(page).toHaveURL(/.*saucedemo\.com\/?$/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});