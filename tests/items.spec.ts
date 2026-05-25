import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { ProductDetailPage } from '../pages/productDetailPage';
import { InventoryPage } from '../pages/inventoryPage';
import { CartPage } from '../pages/cartPage';

const VALID_USER = 'standard_user';
const VALID_PASS = 'secret_sauce';

const PRODUCT_IDS = [0, 1, 2, 3, 4, 5];

test.describe('Item / Product details', () =>{
    let detailPage: ProductDetailPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(VALID_USER, VALID_PASS);
        detailPage = new ProductDetailPage(page);
        await detailPage.goToById(4);
    });

    test('product name should be displayed', async () => {
        await expect(detailPage.productName).toBeVisible();
        expect((await detailPage.getName()).trim().length).toBeGreaterThan(0);
    });

    test('product description should be displayed', async () => {
        await expect(detailPage.productDescription).toBeVisible();
        expect((await detailPage.getDescription()).trim().length).toBeGreaterThan(0);
    });

    test('product price should be displayed and start with $', async () => {
        await expect(detailPage.productPrice).toBeVisible();
        const price = await detailPage.getPrice();
        expect(price).toMatch(/^\$/);
    });

    test('product image should be displayed', async () => {
        await expect(detailPage.productImage).toBeVisible();
        const src = await detailPage.productImage.getAttribute('src');
        expect(src).toBeTruthy();
    });

    test('should show an "Add to cart" button', async () => {
        await expect(detailPage.addToCartButton).toBeVisible();
    });

     test('should add item to cart when "Add to cart" button is clicked', async () => {
        await detailPage.addToCart();
        const cartCount = await detailPage.getCartCount();
        expect(cartCount).toBe(1);
    });

    test('should show a "Remove" button after adding to cart', async () => {
        await detailPage.addToCart();
        await expect(detailPage.removeButton).toBeVisible();
    });

    test('should remove item from cart when "Remove" button is clicked', async () => {
        await detailPage.addToCart();
        await detailPage.removeFromCart();
        const cartCount = await detailPage.getCartCount();
        expect(cartCount).toBe(0);
    });
})

test.describe('Navigation test', () => {
    let detailPage: ProductDetailPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(VALID_USER, VALID_PASS);
        detailPage = new ProductDetailPage(page);
        await detailPage.goToById(4);
    });

    test('clicking a product name on inventory page should navigate to product details page', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.goto();
        const names = await inventoryPage.getProductNames();
        const firstProductName = names[0];
        await inventoryPage.clickProductByIndex(0);
        await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+/);
        await expect(page.locator('.inventory_details_name')).toHaveText(firstProductName);
    });

    test('clicking a product image on inventory page should navigate to product details page', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.goto();
        await page.locator('.inventory_item_img img').first().click();
        await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+/);
    });

    for(const id of PRODUCT_IDS) {
        test(`navigating to product details page with id ${id} should display correct product information`, async ({ page }) => {
            await detailPage.goToById(id);
            await expect(page).toHaveURL(
                new RegExp(`/inventory-item\\.html\\?id=${id}`)
            );
            expect((await detailPage.getName()).trim().length).toBeGreaterThan(0);
        });
    }

    test('adding an item to the cart should update the cart count', async ({ page }) => {
        await detailPage.addToCart();
        await detailPage.goBackToProducts();
        const inventoryPage = new InventoryPage(page);
        expect(await inventoryPage.getCartCount()).toBe(1);
    });

    test('removing an item from the cart should update the cart count', async ({ page }) => {
        await detailPage.addToCart();
        await detailPage.removeFromCart();
        await detailPage.goBackToProducts();
        const inventoryPage = new InventoryPage(page);
        expect(await inventoryPage.getCartCount()).toBe(0);
    });

    test('"Back to products" button should navigate back to inventory page', async ({ page }) => {
        await detailPage.goBackToProducts();
        await expect(page).toHaveURL(/\/inventory\.html/);
    });

});

test.describe('Cart interactions from details page', () => {
    let detailPage: ProductDetailPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(VALID_USER, VALID_PASS);
        detailPage = new ProductDetailPage(page);
        await detailPage.goToById(4);
    });

    test('add to cart should show remove buttons and update badge count', async ({ page }) => {
        await detailPage.addToCart();
        await expect(detailPage.removeButton).toBeVisible();
        await expect(detailPage.addToCartButton).toBeHidden();
        expect(await detailPage.getCartCount()).toBe(1);
    });

    test('remove from cart should show add to cart button and update badge count', async ({ page }) => {
        await detailPage.addToCart();
        await detailPage.removeFromCart();
        await expect(detailPage.addToCartButton).toBeVisible();
        await expect(detailPage.removeButton).toBeHidden();
        expect(await detailPage.getCartCount()).toBe(0);
    });

    test('remove badge should dissapear after removing the only item in the cart', async ({ page }) => {
        await detailPage.addToCart();
        await detailPage.removeFromCart();
        await expect(detailPage.cartBadge).toBeHidden();
    });

    test('added item should be visible in the cart page', async ({ page }) => {
        const name = await detailPage.getName();
        await detailPage.addToCart();
        await page.locator('.shopping_cart_link').click();
        const cartPage = new CartPage(page);
        const cartNames= await cartPage.getItemNames();
        expect(cartNames).toContain(name);
    });

});