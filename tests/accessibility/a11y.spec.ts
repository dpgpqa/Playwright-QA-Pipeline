import { test } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await new AxeBuilder({ page }).analyze();
  });

  test.describe('SauceDemo', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(process.env.SAUCEDEMO_BASE_URL ?? 'https://www.saucedemo.com');
      await new AxeBuilder({ page }).analyze();
    });

    test('@a11y Login page - WCAG 2.1 AA', async ({ page }) => {
      await new AxeBuilder({ page }).analyze();
    });

    test('@a11y Inventory page - WCAG 2.1 AA', async ({ page }) => {
      // Login first
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

    test('@a11y Checkout pages - WCAG 2.1 AA', async ({ page }) => {
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

  test.describe('The Internet', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(process.env.THE_INTERNET_BASE_URL ?? 'https://the-internet.herokuapp.com');
      await new AxeBuilder({ page }).analyze();
    });

    test('@a11y Home page - WCAG 2.1 AA', async ({ page }) => {
      await new AxeBuilder({ page }).analyze();
    });

    test('@a11y Login page - WCAG 2.1 AA', async ({ page }) => {
      await page.goto(`${process.env.THE_INTERNET_BASE_URL ?? 'https://the-internet.herokuapp.com'}/login`);
      await new AxeBuilder({ page }).analyze();
    });

    test('@a11y Checkboxes page - WCAG 2.1 AA', async ({ page }) => {
      await page.goto(`${process.env.THE_INTERNET_BASE_URL ?? 'https://the-internet.herokuapp.com'}/checkboxes`);
      await new AxeBuilder({ page }).analyze();
    });

    test('@a11y Dropdown page - WCAG 2.1 AA', async ({ page }) => {
      await page.goto(`${process.env.THE_INTERNET_BASE_URL ?? 'https://the-internet.herokuapp.com'}/dropdown`);
      await new AxeBuilder({ page }).analyze();
    });
  });

  test.describe('DemoQA', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(process.env.DEMOQA_BASE_URL ?? 'https://demoqa.com');
      await new AxeBuilder({ page }).analyze();
    });

    test('@a11y Home page - WCAG 2.1 AA', async ({ page }) => {
      await new AxeBuilder({ page }).analyze();
    });

    test('@a11y Text Box page - WCAG 2.1 AA', async ({ page }) => {
      await page.goto(`${process.env.DEMOQA_BASE_URL ?? 'https://demoqa.com'}/text-box`);
      await new AxeBuilder({ page }).analyze();
    });

    test('@a11y Check Box page - WCAG 2.1 AA', async ({ page }) => {
      await page.goto(`${process.env.DEMOQA_BASE_URL ?? 'https://demoqa.com'}/checkbox`);
      await new AxeBuilder({ page }).analyze();
    });
  });
});