import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { loginPageLocators } from '../locators/loginPage.locators';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator(loginPageLocators.usernameInput);
    this.passwordInput = page.locator(loginPageLocators.passwordInput);
    this.loginButton = page.locator(loginPageLocators.loginButton);
    this.errorMessage = page.locator(loginPageLocators.errorMessage);
  }

  async goto() {
    await this.navigate('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout() {
    await this.openBurgerMenu();
    await this.logoutLink.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }
}
