import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';

const VALID_USER = 'standard_user';
const VALID_PASS = 'secret_sauce';

/*
All tests passed in a reasonable time frame, with no flakiness observed.
(180 seconds on average for the whole suite, with 72 seconds for Home / inventory path,
85 seconds for burguer menu and 20 seconds for sorting tests)
*/

//Home and Inventory page tests, all passed in 72 seconds on average
test.describe('Home / Inventory Page', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_USER, VALID_PASS);
    inventoryPage = new InventoryPage(page);
  });

  test('"Products" title is visible', async () => {
    await expect(inventoryPage.pageTitle).toBeVisible();
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('Product list is visible', async () => {
    await expect(inventoryPage.productList.first()).toBeVisible();
  });

  test('each product has a name, description, price and image', async ({
    page,
  }) => {
    const names = await inventoryPage.getProductNames();

    const descriptions = await page
      .locator('.inventory_item_desc')
      .allTextContents();

    const prices = await inventoryPage.getProductPrices();

    await expect(names.length).toBeGreaterThan(0);

    expect(descriptions.every((d) => d.trim().length > 0)).toBeTruthy();

    expect(prices.every((p) => p > 0)).toBeTruthy();

    const productItems = page.locator('.inventory_item');

    await expect(productItems).toHaveCount(names.length);

    const imgCount = await productItems.locator('img').count();

    expect(imgCount).toBe(names.length);

    for (let i = 0; i < imgCount; i++) {
      const src = await productItems.locator('img').nth(i).getAttribute('src');

      expect(src).toBeTruthy();
    }
  });

  test('cart badge is not visible when cart is empty', async () => {
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('cart badge is visible when cart has items', async () => {
    await inventoryPage.addProductToCartByIndex(0);
    await expect(inventoryPage.cartBadge).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('add to cart button updates the cart badge', async () => {
    await inventoryPage.addProductToCartByIndex(0);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('Add to cart button should change to "Remove" after adding a product to the cart', async ({
    page,
  }) => {
    await inventoryPage.addProductToCartByIndex(0);
    await expect(page.locator('[data-test^="remove"]').first()).toBeVisible();
  });

  test('Remove button on inventory page should decrement badge count', async ({
    page,
  }) => {
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.removeProductFromCartByIndex(0);
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('clicking a product name should navigate to the product details page', async ({
    page,
  }) => {
    const names = await inventoryPage.getProductNames();
    await inventoryPage.clickProductByIndex(0);
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+/);

    await expect(page.locator('.inventory_details_name')).toHaveText(names[0]);
  });

  test('clickin the cart icon should navigate to /cart.html', async ({
    page,
  }) => {
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/\/cart\.html/);
  });
});

//Burguer menu tests, all passed in 85 seconds on average
test.describe('Burguer menu', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_USER, VALID_PASS);
    inventoryPage = new InventoryPage(page);
  });

  test('burger menu should open and show all sidebar links', async ({
    page,
  }) => {
    await inventoryPage.openBurgerMenu();
    await expect(page.getByRole('link', { name: 'All Items' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Reset App State' }),
    ).toBeVisible();
  });

  test('burger menu X button should close the menu', async ({ page }) => {
    await inventoryPage.openBurgerMenu();
    await inventoryPage.closeBurgerMenu();
    await expect(page.getByRole('navigation')).not.toBeVisible();
  });

  test('Reset App State: should remove cart badge when items are in cart', async ({
    page,
  }) => {
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.addProductToCartByIndex(1);
    expect(await inventoryPage.getCartCount()).toBe(2);

    await inventoryPage.resetAppState();

    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('Reset App State: Add-to-Cart buttons should revert to default state', async ({
    page,
  }) => {
    await inventoryPage.addProductToCartByIndex(0);
    await expect(page.locator('[data-test^="remove"]').first()).toBeVisible();

    await inventoryPage.resetAppState();
    await page.reload();

    await expect(page.locator('[data-test^="add-to-cart"]')).toHaveCount(6);
    await expect(page.locator('[data-test^="remove"]')).toHaveCount(0);
  });

  test('Reset App State: cart page should be empty after reset', async ({
    page,
  }) => {
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.resetAppState();
    await inventoryPage.goToCart();
    await expect(
      page.locator('[data-test="cart-contents-container"] .cart_item'),
    ).toHaveCount(0);
  });

  test('Reset App State: does not log user out', async ({ page }) => {
    await inventoryPage.resetAppState();
    await expect(page).toHaveURL(/.*inventory/);
  });
});

//Sorting tests, all passed in 20 seconds on average
test.describe('Sorting products', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_USER, VALID_PASS);
    inventoryPage = new InventoryPage(page);
  });

  test('default sort should be Name (A to Z)', async () => {
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('sort by Name Z to A', async () => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('sort by Price low to high', async () => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getProductPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by Price high to low', async () => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getProductPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

});