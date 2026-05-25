import { Page, Locator } from "@playwright/test";
import { BasePage } from "./basePage";

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
    this.firstNameInput = page.getByTestId("firstName");
    this.lastNameInput = page.getByTestId("lastName");
    this.postalCodeInput = page.getByTestId("postalCode");

    this.continueButton = page.getByTestId("continue");
    this.cancelButton = page.getByTestId("cancel");

    // Step Two
    this.finishButton = page.getByTestId("finish");

    // Complete
    this.backHomeButton = page.getByTestId("back-to-products");

    this.completeHeader = page.locator(".complete-header");
    this.completeText = page.locator(".complete-text");

    this.pageTitle = page.locator(".title");
  }

  async fillCheckoutInformation(
    firstName: string,
    lastName: string,
    postalCode: string,
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