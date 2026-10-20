import { test, expect } from '../../src/fixtures/base.fixture';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutInfoPage } from '../../src/pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../../src/pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../../src/pages/CheckoutCompletePage';
import { Header } from '../../src/components/Header';
import { getProducts, getDefaultShipping } from '../../src/utils/testData';

test.describe('SauceDemo - Regression Tests', () => {
  const testProducts = getProducts();
  const shipping = getDefaultShipping();

  test.beforeEach(async ({ freshContextPage }) => {
    const loginPage = new LoginPage(freshContextPage);
    await loginPage.goto();
    await loginPage.loginAndWaitForInventory('standard_user', 'secret_sauce');
  });

  test('@regression All products displayed on inventory page', async ({ freshContextPage }) => {
    const inventoryPage = new InventoryPage(freshContextPage);
    const displayedItems = await inventoryPage.itemNames();
    const expectedNames = testProducts.map(p => p.name);
    for (const name of expectedNames) {
      expect(displayedItems).toContain(name);
    }
  });

  test('@regression Add multiple items to cart', async ({ freshContextPage }) => {
    const inventoryPage = new InventoryPage(freshContextPage);
    const header = new Header(freshContextPage);
    const cartPage = new CartPage(freshContextPage);

    const itemsToAdd = ['Sauce Labs Backpack', 'Sauce Labs Bolt T-Shirt', 'Sauce Labs Bike Light'];
    for (const item of itemsToAdd) {
      await inventoryPage.addToCart(item);
    }
    expect(await header.cartBadgeCount()).toBe(itemsToAdd.length);

    await header.openCart();
    const cartItems = await cartPage.getCartItemNames();
    for (const item of itemsToAdd) {
      expect(cartItems).toContain(item);
    }
  });

  test('@regression Remove item from cart on inventory page', async ({ freshContextPage }) => {
    const inventoryPage = new InventoryPage(freshContextPage);
    const header = new Header(freshContextPage);
    await inventoryPage.addToCart('Sauce Labs Backpack');
    expect(await header.cartBadgeCount()).toBe(1);

    await inventoryPage.removeFromCart('Sauce Labs Backpack');
    expect(await header.cartBadgeCount()).toBe(0);
  });

  test('@regression Remove item from cart on cart page', async ({ freshContextPage }) => {
    const inventoryPage = new InventoryPage(freshContextPage);
    const cartPage = new CartPage(freshContextPage);
    const header = new Header(freshContextPage);
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await header.openCart();

    await cartPage.removeItem('Sauce Labs Backpack');
    expect(await header.cartBadgeCount()).toBe(0);
    const cartItems = await cartPage.getCartItemNames();
    expect(cartItems).not.toContain('Sauce Labs Backpack');
  });

  test('@regression Cart persists after navigation', async ({ freshContextPage }) => {
    const inventoryPage = new InventoryPage(freshContextPage);
    const header = new Header(freshContextPage);
    const cartPage = new CartPage(freshContextPage);
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await header.openCart();
    await cartPage.continueShopping();
    expect(await header.cartBadgeCount()).toBe(1);
  });

  test('@regression Checkout with valid info', async ({ freshContextPage }) => {
    const inventoryPage = new InventoryPage(freshContextPage);
    const cartPage = new CartPage(freshContextPage);
    const checkoutInfoPage = new CheckoutInfoPage(freshContextPage);
    const checkoutOverviewPage = new CheckoutOverviewPage(freshContextPage);
    const checkoutCompletePage = new CheckoutCompletePage(freshContextPage);
    const header = new Header(freshContextPage);
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await header.openCart();
    await cartPage.proceedToCheckout();

    await checkoutInfoPage.fillAndContinue({
      firstName: shipping.firstName,
      lastName: shipping.lastName,
      postalCode: shipping.postalCode,
    });

    await checkoutOverviewPage.finish();
    expect(await checkoutCompletePage.confirmationText()).toContain('dispatched');
  });

  test('@regression Checkout validation - empty first name', async ({ freshContextPage }) => {
    const inventoryPage = new InventoryPage(freshContextPage);
    const cartPage = new CartPage(freshContextPage);
    const checkoutInfoPage = new CheckoutInfoPage(freshContextPage);
    const header = new Header(freshContextPage);
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await header.openCart();
    await cartPage.proceedToCheckout();

    await checkoutInfoPage.submitWithoutValidation();
    const error = await checkoutInfoPage.getErrorMessage();
    expect(error).toContain('First Name is required');
  });

  test('@regression Checkout validation - empty last name', async ({ freshContextPage }) => {
    const inventoryPage = new InventoryPage(freshContextPage);
    const cartPage = new CartPage(freshContextPage);
    const checkoutInfoPage = new CheckoutInfoPage(freshContextPage);
    const header = new Header(freshContextPage);
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await header.openCart();
    await cartPage.proceedToCheckout();

    await checkoutInfoPage.firstName.fill(shipping.firstName);
    await checkoutInfoPage.postalCode.fill(shipping.postalCode);
    await checkoutInfoPage.submitWithoutValidation();
    const error = await checkoutInfoPage.getErrorMessage();
    expect(error).toContain('Last Name is required');
  });

  test('@regression Checkout validation - empty postal code', async ({ freshContextPage }) => {
    const inventoryPage = new InventoryPage(freshContextPage);
    const cartPage = new CartPage(freshContextPage);
    const checkoutInfoPage = new CheckoutInfoPage(freshContextPage);
    const header = new Header(freshContextPage);
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await header.openCart();
    await cartPage.proceedToCheckout();

    await checkoutInfoPage.firstName.fill(shipping.firstName);
    await checkoutInfoPage.lastName.fill(shipping.lastName);
    await checkoutInfoPage.submitWithoutValidation();
    const error = await checkoutInfoPage.getErrorMessage();
    expect(error).toContain('Postal Code is required');
  });

  test('@regression Cancel checkout returns to cart', async ({ freshContextPage }) => {
    const inventoryPage = new InventoryPage(freshContextPage);
    const cartPage = new CartPage(freshContextPage);
    const checkoutInfoPage = new CheckoutInfoPage(freshContextPage);
    const checkoutOverviewPage = new CheckoutOverviewPage(freshContextPage);
    const header = new Header(freshContextPage);
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await header.openCart();
    await cartPage.proceedToCheckout();

    await checkoutInfoPage.fillAndContinue(shipping);

    await checkoutOverviewPage.cancel();
    await expect(cartPage.getPage()).toHaveURL(/.*inventory\.html/);
  });

  test('@regression Menu logout works', async ({ freshContextPage }) => {
    const inventoryPage = new InventoryPage(freshContextPage);
    const loginPage = new LoginPage(freshContextPage);
    const header = new Header(freshContextPage);
    await inventoryPage.goto();
    await header.logout();
    await expect(loginPage.getPage()).toHaveURL(/\/(index\.html)?$/);
  });

  test('@regression Menu reset app state clears cart', async ({ freshContextPage }) => {
    const inventoryPage = new InventoryPage(freshContextPage);
    const header = new Header(freshContextPage);
    await inventoryPage.addToCart('Sauce Labs Backpack');
    expect(await header.cartBadgeCount()).toBe(1);

    await header.resetAppState();
    expect(await header.cartBadgeCount()).toBe(0);
  });

  test('@regression Product sort - Name A to Z', async ({ freshContextPage }) => {
    const inventoryPage = new InventoryPage(freshContextPage);
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.itemNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('@regression Product sort - Name Z to A', async ({ freshContextPage }) => {
    const inventoryPage = new InventoryPage(freshContextPage);
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.itemNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('@regression Product sort - Price low to high', async ({ freshContextPage }) => {
    const inventoryPage = new InventoryPage(freshContextPage);
    await inventoryPage.sortBy('lohi');
    await inventoryPage.waitForLoad();
  });

  test('@regression Product sort - Price high to low', async ({ freshContextPage }) => {
    const inventoryPage = new InventoryPage(freshContextPage);
    await inventoryPage.sortBy('hilo');
    await inventoryPage.waitForLoad();
  });
});
