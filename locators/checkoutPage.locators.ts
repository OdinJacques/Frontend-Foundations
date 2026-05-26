import type { LocatorObj } from '../types';

export const checkoutPageLocators: LocatorObj = {
  // XPath Locators

  // CSS / data-test Locators
  firstNameInput: '[data-test="firstName"]',
  lastNameInput: '[data-test="lastName"]',
  postalCodeInput: '[data-test="postalCode"]',
  continueButton: '[data-test="continue"]',
  cancelButton: '[data-test="cancel"]',
  finishButton: '[data-test="finish"]',
  backHomeButton: '[data-test="back-to-products"]',
  errorMessage: '[data-test="error"]',
  completeHeader: '.complete-header',
  completeText: '.complete-text',
  pageTitle: '.title',
};
