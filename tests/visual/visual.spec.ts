import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.describe('SauceDemo', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(process.env.SAUCEDEMO_BASE_URL ?? 'https://www.saucedemo.com');
    });

    test('@visual Login page', async ({ page }) => {
      await expect(page).toHaveScreenshot('saucedemo-login.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('@visual Inventory page', async ({ page }) => {
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

    test('@visual Checkout info page', async ({ page }) => {
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

      await expect(page).toHaveScreenshot('saucedemo-checkout-info.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });
  });

  test.describe('The Internet', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(process.env.THE_INTERNET_BASE_URL ?? 'https://the-internet.herokuapp.com');
    });

    test('@visual Home page', async ({ page }) => {
      await expect(page).toHaveScreenshot('the-internet-home.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('@visual Login page', async ({ page }) => {
      await page.goto(`${process.env.THE_INTERNET_BASE_URL ?? 'https://the-internet.herokuapp.com'}/login`);
      await expect(page).toHaveScreenshot('the-internet-login.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('@visual Checkboxes page', async ({ page }) => {
      await page.goto(`${process.env.THE_INTERNET_BASE_URL ?? 'https://the-internet.herokuapp.com'}/checkboxes`);
      await expect(page).toHaveScreenshot('the-internet-checkboxes.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('@visual Dropdown page', async ({ page }) => {
      await page.goto(`${process.env.THE_INTERNET_BASE_URL ?? 'https://the-internet.herokuapp.com'}/dropdown`);
      await expect(page).toHaveScreenshot('the-internet-dropdown.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });
  });

  test.describe('DemoQA', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(process.env.DEMOQA_BASE_URL ?? 'https://demoqa.com');
    });

    test('@visual Home page', async ({ page }) => {
      await expect(page).toHaveScreenshot('demoqa-home.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('@visual Text Box page', async ({ page }) => {
      await page.goto(`${process.env.DEMOQA_BASE_URL ?? 'https://demoqa.com'}/text-box`);
      await expect(page).toHaveScreenshot('demoqa-textbox.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('@visual Check Box page', async ({ page }) => {
      await page.goto(`${process.env.DEMOQA_BASE_URL ?? 'https://demoqa.com'}/checkbox`);
      await expect(page).toHaveScreenshot('demoqa-checkbox.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });
  });
});