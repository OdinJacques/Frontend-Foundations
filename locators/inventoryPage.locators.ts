import type { LocatorObj } from '../types';

export const inventoryPageLocators: LocatorObj = {
  // XPath Locators

  // CSS / data-test Locators
  productList: '[data-test="inventory-item"]',
  productName: '[data-test="inventory-item-name"]',
  productDescription: '[data-test="inventory-item-desc"]',
  productPrice: '[data-test="inventory-item-price"]',
  sortDropdown: '[data-test="product-sort-container"]',
  cartBadge: '[data-test="shopping-cart-badge"]',
  cartIcon: '[data-test="shopping-cart-link"]',
  addToCartButtons: '[data-test^="add-to-cart"]',
  removeButtons: '[data-test^="remove"]',
  pageTitle: '.title',
};
