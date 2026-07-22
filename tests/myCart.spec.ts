import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { CartPage } from '../pages/cartPage';

const VALID_USER = 'standard_user';
const VALID_PASS = 'secret_sauce';

test.describe('My cart', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_USER, VALID_PASS);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
  });

  test('cart should be empty on first login', async () => {
    await inventoryPage.goToCart();
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(0);
  });

  test('should show "Your Cart" as page title', async () => {
    await inventoryPage.goToCart();
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
  });

  test('checkout button should be visible even on empty cart', async () => {
    await inventoryPage.goToCart();
    await expect(cartPage.checkoutButton).toBeVisible();
  });

  test('continue shopping button should be visible on cart page and functional', async () => {
    await inventoryPage.goToCart();
    await expect(cartPage.continueShoppingButton).toBeVisible();
    await cartPage.continueShoppingButton.click();
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('cart items should persist when navigating back and forth between inventory and cart', async () => {
    await inventoryPage.addProductToCartByIndex(1);
    await inventoryPage.goToCart();
    let itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);
    await cartPage.continueShoppingButton.click();
    await inventoryPage.goToCart();
    itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);
  });
});
