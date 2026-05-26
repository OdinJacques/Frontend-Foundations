import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { checkoutPageLocators } from '../locators/checkoutPage.locators';

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;

  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly backHomeButton: Locator;

  readonly completeHeader: Locator;
  readonly completeText: Locator;

  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);

    // Step One
    this.firstNameInput = page.locator(checkoutPageLocators.firstNameInput);
    this.lastNameInput = page.locator(checkoutPageLocators.lastNameInput);
    this.postalCodeInput = page.locator(checkoutPageLocators.postalCodeInput);
    this.continueButton = page.locator(checkoutPageLocators.continueButton);
    this.cancelButton = page.locator(checkoutPageLocators.cancelButton);

    // Step Two
    this.finishButton = page.locator(checkoutPageLocators.finishButton);

    // Complete
    this.backHomeButton = page.locator(checkoutPageLocators.backHomeButton);
    this.completeHeader = page.locator(checkoutPageLocators.completeHeader);
    this.completeText = page.locator(checkoutPageLocators.completeText);
    this.pageTitle = page.locator(checkoutPageLocators.pageTitle);
  }

  async fillCheckoutInformation(
    firstName: string,
    lastName: string,
    postalCode: string
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueCheckout() {
    await this.continueButton.click();
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async backHome() {
    await this.backHomeButton.click();
  }
}
