import { Page, Locator } from "@playwright/test";
import { BasePage } from "./basePage";

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly removeButtons: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutButton = page.getByTestId("checkout");
    this.continueShoppingButton = page.getByTestId("continue-shopping");
    this.removeButtons = page.locator('[data-test^="remove"]');
    this.cartItems = page.locator(
      '[data-test="cart-contents-container"] .cart_item',
    );
    this.pageTitle = page.locator(".title");
  }

  async goTo() {
    await this.navigate("/cart.html");
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getItemNames(): Promise<string[]> {
    return this.page.getByTestId("inventory-item-name").allTextContents();
  }

  async getItemPrices(): Promise<string[]> {
    const raw = await this.page
      .getByTestId("inventory-item-price")
      .allTextContents();
    return raw.map((price) => price.replace("$", ""));
  }

  async getItemQuantity(): Promise<number[]> {
    const raw = await this.page.getByTestId("cart_quantity").allTextContents();
    return raw.map((qty) => parseInt(qty));
  }

  async removeItemByName(name: string) {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    await this.page.getByTestId(`remove-${slug}`).click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
