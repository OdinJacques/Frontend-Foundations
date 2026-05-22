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

    this.productList = page.locator(".inventory_item");
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartIcon = page.locator(".shopping_cart_link");
    this.pageTitle = page.locator(".title");
  }

  async goto() {
    await this.navigate("/inventory.html");
  }

  async getProductNames(): Promise<string[]> {
    return await this.page.locator(".inventory_item_name").allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const raw = await this.page
      .locator(".inventory_item_price")
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
    await this.page.locator(".inventory_item_name").nth(index).click();
  }

  async sortBy(option: "az" | "za" | "lohi" | "hilo") {
    await this.sortDropdown.selectOption(option);
  }

  async getCartCount(): Promise<number> {
    const text = await this.cartBadge.textContent();

    return text ? parseInt(text) : 0;
  }

  async goToCart() {
    await this.cartIcon.click();
  }
}
