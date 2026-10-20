import { test } from '../../src/fixtures/base.fixture';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test.describe('SauceDemo', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('@a11y Login page - WCAG 2.1 AA', async ({ page }) => {
      await new AxeBuilder({ page }).analyze();
    });

    test('@a11y Inventory page - WCAG 2.1 AA', async ({ page }) => {
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
      await page.waitForURL('**/inventory.html');

      await new AxeBuilder({ page }).analyze();
    });

    test('@a11y Cart page - WCAG 2.1 AA', async ({ page }) => {
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
      await page.waitForURL('**/inventory.html');
      await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
      await page.click('[data-test="shopping-cart-link"]');
      await page.waitForURL('**/cart.html');

      await new AxeBuilder({ page }).analyze();
    });

    test('@a11y Checkout page - WCAG 2.1 AA', async ({ page }) => {
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
      await page.waitForURL('**/inventory.html');
      await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
      await page.click('[data-test="shopping-cart-link"]');
      await page.waitForURL('**/cart.html');
      await page.click('[data-test="checkout"]');
      await page.waitForURL('**/checkout-step-one.html');

      await new AxeBuilder({ page }).analyze();
    });
  });
});
