import { Page, Locator } from "@playwright/test";
import { BasePage } from "./basePage";

export class InventoryPage extends BasePage {
  readonly productList: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.productList = page.getByTestId("inventory-item");
    this.sortDropdown = page.getByTestId("product-sort-container");
    this.cartBadge = page.getByTestId("shopping-cart-badge");
    this.cartIcon = page.getByTestId("shopping-cart-link");
    this.pageTitle = page.locator(".title");
  }

  async goto() {
    await this.navigate("/inventory.html");
  }

  async getProductNames(): Promise<string[]> {
    return this.page.getByTestId("inventory-item-name").allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const raw = await this.page
      .getByTestId("inventory-item-price")
      .allTextContents();
    return raw.map((p) => parseFloat(p.replace("$", "")));
  }

  async addProductToCartByIndex(index: number) {
    await this.page.locator('[data-test^="add-to-cart"]').nth(index).click();
  }

  async removeProductFromCartByIndex(index: number) {
    await this.page.locator('[data-test^="remove"]').nth(index).click();
  }

  async addProductToCartByName(name: string) {
    const slug = name.toLowerCase().replace(/ /g, "-");
    await this.page.getByTestId(`add-to-cart-${slug}`).click();
  }

  async clickProductByIndex(index: number) {
    await this.page.getByTestId("inventory-item-name").nth(index).click();
  }

  async sortBy(option: "az" | "za" | "lohi" | "hilo") {
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
