import type { LocatorObj } from '../types';

export const productDetailPageLocators: LocatorObj = {
  // XPath Locators

  // CSS / data-test Locators
  productName: '[data-test="inventory-item-name"]',
  productDescription: '[data-test="inventory-item-desc"]',
  productPrice: '[data-test="inventory-item-price"]',
  productImage: '.inventory_details_img', // no data-test on this element
  addToCartButton: '[data-test^="add-to-cart"]',
  removeButton: '[data-test^="remove"]',
  backToProductsButton: '[data-test="back-to-products"]',
  cartBadge: '[data-test="shopping-cart-badge"]',
};
