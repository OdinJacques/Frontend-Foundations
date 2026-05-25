import { Page, Locator } from "@playwright/test";
import { BasePage } from "./basePage";

export class ProductDetailPage extends BasePage {
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly productImage: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backToProductsButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator(".inventory_details_name");
    this.productDescription = page.locator(".inventory_details_desc");
    this.productPrice = page.locator(".inventory_details_price");
    this.productImage = page.locator(".inventory_details_img");
    this.addToCartButton = page.locator('button[data-test^="add-to-cart"]');
    this.removeButton = page.locator('button[data-test^="remove"]');
    this.backToProductsButton = page.locator(
      'button[data-test="back-to-products"]',
    );
    this.cartBadge = page.locator(".shopping_cart_badge");
  }

  async goToById(id: number) {
    await this.navigate(`/inventory-item.html?id=${id}`);
  }

  async getName(): Promise<string> {
    return (await this.productName.textContent()) ?? "";
  }

  async getDescription(): Promise<string> {
    return (await this.productDescription.textContent()) ?? "";
  }

  async getPrice(): Promise<string> {
    return (await this.productPrice.textContent()) ?? "";
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async removeFromCart() {
    await this.removeButton.click();
  }

  async goBackToProducts() {
    await this.backToProductsButton.click();
  }

  async getCartCount(): Promise<number> {
    if(await this.cartBadge.count() === 0) return 0;
    const text = await this.cartBadge.textContent();
    return text ? parseInt(text) : 0;
  }
}
