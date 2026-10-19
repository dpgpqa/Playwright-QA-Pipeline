import { test, expect } from '@fixtures/base.fixture';

test.describe('SauceDemo - Smoke Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('@smoke Standard user can login successfully', async ({ loginPage, inventoryPage }) => {
    await loginPage.loginAndWaitForInventory('standard_user', 'secret_sauce');
    await expect(inventoryPage.getPage()).toHaveURL(/.*inventory\.html/);
    await expect(inventoryPage.isLoaded()).resolves.toBeTruthy();
  });

  test('@smoke Locked out user cannot login', async ({ loginPage }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('locked out');
  });

  test('@smoke Invalid credentials show error', async ({ loginPage }) => {
    await loginPage.login('invalid_user', 'invalid_pass');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username and password do not match');
  });

  test('@smoke Problem user can login but has UI issues', async ({ loginPage, inventoryPage }) => {
    await loginPage.loginAndWaitForInventory('problem_user', 'secret_sauce');
    await expect(inventoryPage.getPage()).toHaveURL(/.*inventory\.html/);
  });
});

test.describe('SauceDemo - Cart Smoke Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAndWaitForInventory('standard_user', 'secret_sauce');
  });

  test('@smoke Add item to cart updates badge', async ({ inventoryPage, header }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    expect(await header.getCartCount()).toBe(1);
  });

  test('@smoke Remove item from cart updates badge', async ({ inventoryPage, header }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.removeItemFromCart('Sauce Labs Backpack');
    expect(await header.getCartCount()).toBe(0);
  });

  test('@smoke Navigate to cart page', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await expect(cartPage.getPage()).toHaveURL(/.*cart\.html/);
    const items = await cartPage.getCartItemNames();
    expect(items).toContain('Sauce Labs Backpack');
  });
});

test.describe('SauceDemo - Checkout Smoke Tests', () => {
  test.beforeEach(async ({ loginPage, inventoryPage, cartPage }) => {
    await loginPage.goto();
    await loginPage.loginAndWaitForInventory('standard_user', 'secret_sauce');
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
  });

  test('@smoke Complete checkout flow', async ({ checkoutInfoPage, checkoutOverviewPage, checkoutCompletePage }) => {
    await checkoutInfoPage.fillInfo('John', 'Doe', '12345');
    await checkoutInfoPage.continue();

    const subtotal = await checkoutOverviewPage.getSubtotal();
    const tax = await checkoutOverviewPage.getTax();
    const total = await checkoutOverviewPage.getTotal();
    expect(total).toBeCloseTo(subtotal + tax, 2);

    await checkoutOverviewPage.finish();
    await expect(checkoutCompletePage.getPage()).toHaveURL(/.*checkout-complete\.html/);
    expect(await checkoutCompletePage.isOrderComplete()).toBeTruthy();
  });
});
