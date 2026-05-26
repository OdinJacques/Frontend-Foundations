import type { LocatorObj } from '../types';

export const loginPageLocators: LocatorObj = {
  // XPath Locators

  // CSS / data-test Locators
  usernameInput: '[data-test="username"]',
  passwordInput: '[data-test="password"]',
  loginButton: '[data-test="login-button"]',
  errorMessage: '[data-test="error"]',
  loginLogo: '.login_logo',
  loginCredentials: '#login_credentials',
  loginPassword: '#login_password',
};
