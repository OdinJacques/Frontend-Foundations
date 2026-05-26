import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { cartPageLocators } from '../locators/cartPage.locators';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly removeButtons: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutButton = page.locator(cartPageLocators.checkoutButton);
    this.continueShoppingButton = page.locator(
      cartPageLocators.continueShoppingButton
    );
    this.removeButtons = page.locator(cartPageLocators.removeButtons);
    this.cartItems = page.locator(cartPageLocators.cartItems);
    this.pageTitle = page.locator(cartPageLocators.pageTitle);
  }

  async goTo() {
    await this.navigate('/cart.html');
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator(cartPageLocators.productName).allTextContents();
  }

  async getItemPrices(): Promise<string[]> {
    const raw = await this.page
      .locator(cartPageLocators.productPrice)
      .allTextContents();
    return raw.map((price) => price.replace('$', ''));
  }

  async getItemQuantity(): Promise<number[]> {
    const raw = await this.page
      .locator(cartPageLocators.cartQuantity)
      .allTextContents();
    return raw.map((qty) => parseInt(qty));
  }

  async removeItemByName(name: string) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    await this.page.locator(`[data-test="remove-${slug}"]`).click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
