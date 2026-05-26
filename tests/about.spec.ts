import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { InventoryPage } from "../pages/inventoryPage";

const VALID_USER = "standard_user";
const VALID_PASS = "secret_sauce";
let inventoryPage: InventoryPage;

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(VALID_USER, VALID_PASS);
  inventoryPage = new InventoryPage(page);
});

test("About menu option should redirect to Sauce Labs website", async ({
  page,
}) => {
  await inventoryPage.openBurgerMenu();
  await expect(page.getByRole("link", { name: "About" }).click());
  await expect(page).toHaveURL(/saucelabs\.com/);
  await expect(page.locator("body")).toContainText(
    "The World's Only Full-Lifecycle AI-Quality Platform",
  );
});
