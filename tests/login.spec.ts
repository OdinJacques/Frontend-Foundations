import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';

const VALID_USER = 'standard_user';
const VALID_PASS = 'secret_sauce';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Login elements are being displayed', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('Accepted credentials hint should be visible', async ({ page }) => {
    await expect(page.locator('#login_credentials')).toBeVisible();
    await expect(page.locator('.login_password')).toBeVisible();
  });

  test('Standard user should redirect to /inventory.html', async ({ page }) => {
    await loginPage.login(VALID_USER, VALID_PASS);
    await expect(page).toHaveURL(/.*inventory/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('problem_user should login but show broken images', async ({ page }) => {
    await loginPage.login('problem_user', VALID_PASS);
    await expect(page).toHaveURL(/.*inventory/);
    await expect(page.getByTestId('inventory-item').first()).toBeVisible();

    const inventoryPage = new InventoryPage(page);
    const productNames = await inventoryPage.getProductNames();
    const productPrices = await inventoryPage.getProductPrices();

    expect(productNames.length).toBeGreaterThan(0);
    expect(productPrices.length).toBeGreaterThan(0);

    const brokenImages = page.locator('.inventory_item_img img[src*="sl-404"]');
    await expect(brokenImages).toHaveCount(productNames.length);
  });

  test('Performance glitch user should login but with a delay', async ({
    page,
  }) => {
    await loginPage.login('performance_glitch_user', VALID_PASS);
    await expect(page).toHaveURL(/.*inventory/);
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

test.describe('Error states', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('locked_out_user: should show locked-out error', async () => {
    await loginPage.login('locked_out_user', VALID_PASS);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Sorry, this user has been locked out');
  });

  test('Wrong password should show credentials mismatch error', async () => {
    await loginPage.login(VALID_USER, 'Wrong_Password');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username and password do not match');
  });

  test('Both fields empty should show username-required error', async () => {
    await loginPage.login('', '');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username is required');
  });

  test('Unknown username should show credentials mismatch error', async () => {
    await loginPage.login('nouser', VALID_PASS);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain(
      'Username and password do not match any user in this service'
    );
  });
});

test.describe('Logout', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Should log out and return to login page', async ({ page }) => {
    await loginPage.login(VALID_USER, VALID_PASS);
    await loginPage.logout();
    await expect(page).toHaveURL(/.*saucedemo\.com\/?$/);
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('Should not access inventory page after logout', async ({ page }) => {
    await loginPage.login(VALID_USER, VALID_PASS);
    await loginPage.logout();
    await page.goto('/inventory.html');
    await expect(page).toHaveURL(/.*saucedemo\.com\/?$/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
