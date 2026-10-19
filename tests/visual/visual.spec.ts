import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.describe('SauceDemo', () => {
    test('@visual Login page', async ({ page }) => {
      await page.goto(process.env.BASE_URL ?? 'https://www.saucedemo.com');
      await expect(page).toHaveScreenshot('saucedemo-login.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('@visual Inventory page', async ({ page }) => {
      await page.goto(process.env.BASE_URL ?? 'https://www.saucedemo.com');
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
      await page.waitForURL('**/inventory.html');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('saucedemo-inventory.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('@visual Cart page', async ({ page }) => {
      await page.goto(process.env.BASE_URL ?? 'https://www.saucedemo.com');
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
      await page.waitForURL('**/inventory.html');
      await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
      await page.click('[data-test="shopping-cart-link"]');
      await page.waitForURL('**/cart.html');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('saucedemo-cart.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('@visual Checkout page', async ({ page }) => {
      await page.goto(process.env.BASE_URL ?? 'https://www.saucedemo.com');
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
      await page.waitForURL('**/inventory.html');
      await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
      await page.click('[data-test="shopping-cart-link"]');
      await page.waitForURL('**/cart.html');
      await page.click('[data-test="checkout"]');
      await page.waitForURL('**/checkout-step-one.html');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('saucedemo-checkout.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });
  });
});