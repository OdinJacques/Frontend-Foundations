import { Page, Locator } from '@playwright/test';
import { basePageLocators } from '../locators/basePage.locators';

export class BasePage {
  readonly page: Page;
  readonly openBurgerMenuBtn: Locator;
  readonly closeBurgerMenuBtn: Locator;
  readonly burgerMenu: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.openBurgerMenuBtn = page.locator(basePageLocators.openBurgerMenuBtn);
    this.closeBurgerMenuBtn = page.locator(basePageLocators.closeBurgerMenuBtn);
    this.burgerMenu = page.locator(basePageLocators.burgerMenu);
    this.logoutLink = page.locator(basePageLocators.logoutLink);
    this.resetAppStateLink = page.locator(basePageLocators.resetAppStateLink);
  }

  async navigate(path: string = '') {
    await this.page.goto(`https://www.saucedemo.com${path}`);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  // ── Burger menu helpers (available on every authenticated page) ──────────

  async openBurgerMenu() {
    await this.openBurgerMenuBtn.click();
    await this.burgerMenu.waitFor({ state: 'visible' });
  }

  async closeBurgerMenu() {
    await this.closeBurgerMenuBtn.click();
    await this.burgerMenu.waitFor({ state: 'hidden' });
  }

  async logout() {
    await this.openBurgerMenu();
    await this.logoutLink.click();
  }

  async resetAppState() {
    await this.openBurgerMenu();
    await this.resetAppStateLink.click();
    await this.closeBurgerMenu();
  }
}
