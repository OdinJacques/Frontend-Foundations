import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { productDetailPageLocators } from '../locators/productDetailPage.locators';

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
    this.productName = page.locator(productDetailPageLocators.productName);
    this.productDescription = page.locator(
      productDetailPageLocators.productDescription
    );
    this.productPrice = page.locator(productDetailPageLocators.productPrice);
    this.productImage = page.locator(productDetailPageLocators.productImage);
    this.addToCartButton = page.locator(
      productDetailPageLocators.addToCartButton
    );
    this.removeButton = page.locator(productDetailPageLocators.removeButton);
    this.backToProductsButton = page.locator(
      productDetailPageLocators.backToProductsButton
    );
    this.cartBadge = page.locator(productDetailPageLocators.cartBadge);
  }

  async goToById(id: number) {
    await this.navigate(`/inventory-item.html?id=${id}`);
  }

  async getName(): Promise<string> {
    return (await this.productName.textContent()) ?? '';
  }

  async getDescription(): Promise<string> {
    return (await this.productDescription.textContent()) ?? '';
  }

  async getPrice(): Promise<string> {
    return (await this.productPrice.textContent()) ?? '';
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
    if ((await this.cartBadge.count()) === 0) return 0;
    const text = await this.cartBadge.textContent();
    return text ? parseInt(text) : 0;
  }
}
