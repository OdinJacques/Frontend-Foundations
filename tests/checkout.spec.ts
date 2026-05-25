import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { InventoryPage } from "../pages/inventoryPage";
import { CartPage } from "../pages/cartPage";
import { CheckoutPage } from "../pages/checkoutPage";

const VALID_USER = "standard_user";
const VALID_PASS = "secret_sauce";

test.describe("Checkout Flow", () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_USER, VALID_PASS);
    await expect(page).toHaveURL(/inventory/);

    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await inventoryPage.resetAppState();
  });

  test("user should complete purchase successfully", async ({ page }) => {
    await inventoryPage.addProductToCartByIndex(0);
    await expect(inventoryPage.cartBadge).toHaveText("1");
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart/);
    await expect(cartPage.cartItems).toHaveCount(1);
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one/);
    await checkoutPage.fillCheckoutInformation(
      "Alexander",
      "Bocanegra",
      "12345",
    );
    await checkoutPage.continueCheckout();
    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(checkoutPage.pageTitle).toHaveText("Checkout: Overview");
    await checkoutPage.finishCheckout();
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(checkoutPage.completeHeader).toHaveText(
      "Thank you for your order!",
    );
    await expect(checkoutPage.completeText).toContainText(
      "Your order has been dispatched",
    );
    await checkoutPage.backHome();
    await expect(page).toHaveURL(/inventory/);
    await expect(inventoryPage.pageTitle).toHaveText("Products");
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test("should show error when first name is missing", async ({ page }) => {
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInformation("", "Lastname", "12345");
    await checkoutPage.continueCheckout();
    await expect(page.getByTestId("error")).toHaveText(
      "Error: First Name is required",
    );
    await expect(page).toHaveURL(/checkout-step-one/);
  });

  test("should show error when last name is missing", async ({ page }) => {
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInformation("Firstname", "", "12345");
    await checkoutPage.continueCheckout();
    await expect(page.getByTestId("error")).toHaveText(
      "Error: Last Name is required",
    );
    await expect(page).toHaveURL(/checkout-step-one/);
  });

  test("should show error when postal code is missing", async ({ page }) => {
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInformation("Firstname", "Lastname", "");
    await checkoutPage.continueCheckout();
    await expect(page.getByTestId("error")).toHaveText(
      "Error: Postal Code is required",
    );
    await expect(page).toHaveURL(/checkout-step-one/);
  });
});
