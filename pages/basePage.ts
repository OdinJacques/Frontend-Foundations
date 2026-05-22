import { Page } from '@playwright/test';
 
export class BasePage {
  constructor(protected page: Page) {}
 
  async navigate(path: string = '') {
    await this.page.goto(`https://www.saucedemo.com${path}`);
  }
 
  async getTitle(): Promise<string> {
    return this.page.title();
  }
 
  //Burger menu helpers (available on every authenticated page) 
 
  async openBurgerMenu() {
    await this.page.getByRole('button', { name: 'Open Menu '}).click();
    await this.page.getByRole('navigation').waitFor({ state: 'visible' });
  }
 
  async closeBurgerMenu() {
    await this.page.getByRole('button', { name: 'Close Menu '}).click();
    await this.page.getByRole('navigation').waitFor({ state: 'hidden' });
  }
 
  async logout() {
    await this.openBurgerMenu();
    await this.page.getByRole('link', { name: 'Logout' }).click();
  }
 
  async resetAppState() {
    await this.openBurgerMenu();
    await this.page.getByRole('link', { name: 'Reset App State' }).click();
    await this.closeBurgerMenu();
  }
}