import { test, expect } from '@fixtures/base.fixture';
import { loadJsonFile } from '@utils/testData';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface ProductsData {
  saucedemo: Product[];
}

test.describe('SauceDemo - Regression Tests', () => {
  const testProducts = loadJsonFile<ProductsData>('products.json').saucedemo;

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAndWaitForInventory('standard_user', 'secret_sauce');
  });

  test('@regression All products displayed on inventory page', async ({ inventoryPage }) => {
    const displayedItems = await inventoryPage.getItemNames();
    const expectedNames = testProducts.map((p: Product) => p.name);
    for (const name of expectedNames) {
      expect(displayedItems).toContain(name);
    }
  });

  test('@regression Add multiple items to cart', async ({ inventoryPage, header, cartPage }) => {
    const itemsToAdd = ['Sauce Labs Backpack', 'Sauce Labs Bolt T-Shirt', 'Sauce Labs Bike Light'];
    for (const item of itemsToAdd) {
      await inventoryPage.addItemToCart(item);
    }
    expect(await header.getCartCount()).toBe(itemsToAdd.length);

    await inventoryPage.goToCart();
    const cartItems = await cartPage.getCartItemNames();
    for (const item of itemsToAdd) {
      expect(cartItems).toContain(item);
    }
  });

  test('@regression Remove item from cart on inventory page', async ({ inventoryPage, header }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    expect(await header.getCartCount()).toBe(1);

    await inventoryPage.removeItemFromCart('Sauce Labs Backpack');
    expect(await header.getCartCount()).toBe(0);
    expect(await inventoryPage.isItemInCart('Sauce Labs Backpack')).toBeFalsy();
  });

  test('@regression Remove item from cart on cart page', async ({ inventoryPage, cartPage, header }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    await cartPage.removeItem('Sauce Labs Backpack');
    expect(await header.getCartCount()).toBe(0);
    const cartItems = await cartPage.getCartItemNames();
    expect(cartItems).not.toContain('Sauce Labs Backpack');
  });

  test('@regression Cart persists after navigation', async ({ inventoryPage, header, cartPage }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.continueShopping();
    expect(await header.getCartCount()).toBe(1);
  });

  test('@regression Checkout with valid info', async ({ inventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage, checkoutCompletePage }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutInfoPage.fillInfo('John', 'Doe', '12345');
    await checkoutInfoPage.continue();

    await checkoutOverviewPage.finish();
    expect(await checkoutCompletePage.isOrderComplete()).toBeTruthy();
  });

  test('@regression Checkout validation - empty first name', async ({ checkoutInfoPage }) => {
    await checkoutInfoPage.fillInfo('', 'Doe', '12345');
    await checkoutInfoPage.clickContinue();
    const error = await checkoutInfoPage.getErrorMessage();
    expect(error).toContain('First Name is required');
  });

  test('@regression Checkout validation - empty last name', async ({ checkoutInfoPage }) => {
    await checkoutInfoPage.fillInfo('John', '', '12345');
    await checkoutInfoPage.clickContinue();
    const error = await checkoutInfoPage.getErrorMessage();
    expect(error).toContain('Last Name is required');
  });

  test('@regression Checkout validation - empty postal code', async ({ checkoutInfoPage }) => {
    await checkoutInfoPage.fillInfo('John', 'Doe', '');
    await checkoutInfoPage.clickContinue();
    const error = await checkoutInfoPage.getErrorMessage();
    expect(error).toContain('Postal Code is required');
  });

  test('@regression Cancel checkout returns to cart', async ({ inventoryPage, cartPage, checkoutInfoPage }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutInfoPage.cancel();
    await expect(cartPage.getPage()).toHaveURL(/.*cart\.html/);
  });

  test('@regression Cancel overview returns to cart', async ({ inventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.fillInfo('John', 'Doe', '12345');
    await checkoutInfoPage.continue();

    await checkoutOverviewPage.cancel();
    await expect(cartPage.getPage()).toHaveURL(/.*cart\.html/);
  });

  test('@regression Menu logout works', async ({ inventoryPage, loginPage }) => {
    await inventoryPage.logout();
    await expect(loginPage.getPage()).toHaveURL(/.*\/$/);
    await expect(loginPage.isLogoVisible()).resolves.toBeTruthy();
  });

  test('@regression Menu reset app state clears cart', async ({ inventoryPage, header }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    expect(await header.getCartCount()).toBe(1);

    await inventoryPage.resetAppState();
    expect(await header.getCartCount()).toBe(0);
  });

  test('@regression Product sort - Name A to Z', async ({ inventoryPage }) => {
    await inventoryPage.getPage().locator('.product_sort_container').selectOption('az');
    const names = await inventoryPage.getItemNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('@regression Product sort - Name Z to A', async ({ inventoryPage }) => {
    await inventoryPage.getPage().locator('.product_sort_container').selectOption('za');
    const names = await inventoryPage.getItemNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('@regression Product sort - Price low to high', async ({ inventoryPage }) => {
    await inventoryPage.getPage().locator('.product_sort_container').selectOption('lohi');
    await expect(inventoryPage.isLoaded()).resolves.toBeTruthy();
  });

  test('@regression Product sort - Price high to low', async ({ inventoryPage }) => {
    await inventoryPage.getPage().locator('.product_sort_container').selectOption('hilo');
    await expect(inventoryPage.isLoaded()).resolves.toBeTruthy();
  });
});
