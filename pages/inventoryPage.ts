import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { inventoryPageLocators } from '../locators/inventoryPage.locators';

export class InventoryPage extends BasePage {
  readonly productList: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.productList = page.locator(inventoryPageLocators.productList);
    this.sortDropdown = page.locator(inventoryPageLocators.sortDropdown);
    this.cartBadge = page.locator(inventoryPageLocators.cartBadge);
    this.cartIcon = page.locator(inventoryPageLocators.cartIcon);
    this.pageTitle = page.locator(inventoryPageLocators.pageTitle);
  }

  async goto() {
    await this.navigate('/inventory.html');
  }

  async getProductNames(): Promise<string[]> {
    return this.page
      .locator(inventoryPageLocators.productName)
      .allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const raw = await this.page
      .locator(inventoryPageLocators.productPrice)
      .allTextContents();
    return raw.map((p) => parseFloat(p.replace('$', '')));
  }

  async addProductToCartByIndex(index: number) {
    await this.page
      .locator(inventoryPageLocators.addToCartButtons)
      .nth(index)
      .click();
  }

  async removeProductFromCartByIndex(index: number) {
    await this.page
      .locator(inventoryPageLocators.removeButtons)
      .nth(index)
      .click();
  }

  async addProductToCartByName(name: string) {
    const slug = name.toLowerCase().replace(/ /g, '-');
    await this.page.locator(`[data-test="add-to-cart-${slug}"]`).click();
  }

  async clickProductByIndex(index: number) {
    await this.page
      .locator(inventoryPageLocators.productName)
      .nth(index)
      .click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async getCartCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) return 0;
    const text = await this.cartBadge.textContent();
    return text ? parseInt(text) : 0;
  }

  async goToCart() {
    await this.cartIcon.click();
  }
}
