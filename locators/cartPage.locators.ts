import type { LocatorObj } from '../types';

export const cartPageLocators: LocatorObj = {
  // XPath Locators

  // CSS / data-test Locators
  checkoutButton: '[data-test="checkout"]',
  continueShoppingButton: '[data-test="continue-shopping"]',
  removeButtons: '[data-test^="remove"]',
  cartItems: '[data-test="cart-contents-container"] .cart_item',
  productName: '[data-test="inventory-item-name"]',
  productPrice: '[data-test="inventory-item-price"]',
  cartQuantity: '[data-test="cart_quantity"]',
  pageTitle: '.title',
};
