import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
  });

  test.describe('SauceDemo', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(process.env.SAUCEDEMO_BASE_URL ?? 'https://www.saucedemo.com');
      await injectAxe(page);
    });

    test('@a11y Login page - WCAG 2.1 AA', async ({ page }) => {
      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    });

    test('@a11y Inventory page - WCAG 2.1 AA', async ({ page }) => {
      // Login first
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
      await page.waitForURL('**/inventory.html');

      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    });

    test('@a11y Cart page - WCAG 2.1 AA', async ({ page }) => {
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
      await page.waitForURL('**/inventory.html');
      await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
      await page.click('[data-test="shopping-cart-link"]');
      await page.waitForURL('**/cart.html');

      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
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

      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    });
  });

  test.describe('The Internet', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(process.env.THE_INTERNET_BASE_URL ?? 'https://the-internet.herokuapp.com');
      await injectAxe(page);
    });

    test('@a11y Home page - WCAG 2.1 AA', async ({ page }) => {
      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    });

    test('@a11y Login page - WCAG 2.1 AA', async ({ page }) => {
      await page.goto(`${process.env.THE_INTERNET_BASE_URL ?? 'https://the-internet.herokuapp.com'}/login`);
      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    });

    test('@a11y Checkboxes page - WCAG 2.1 AA', async ({ page }) => {
      await page.goto(`${process.env.THE_INTERNET_BASE_URL ?? 'https://the-internet.herokuapp.com'}/checkboxes`);
      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    });

    test('@a11y Dropdown page - WCAG 2.1 AA', async ({ page }) => {
      await page.goto(`${process.env.THE_INTERNET_BASE_URL ?? 'https://the-internet.herokuapp.com'}/dropdown`);
      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    });
  });

  test.describe('DemoQA', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(process.env.DEMOQA_BASE_URL ?? 'https://demoqa.com');
      await injectAxe(page);
    });

    test('@a11y Home page - WCAG 2.1 AA', async ({ page }) => {
      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    });

    test('@a11y Text Box page - WCAG 2.1 AA', async ({ page }) => {
      await page.goto(`${process.env.DEMOQA_BASE_URL ?? 'https://demoqa.com'}/text-box`);
      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    });

    test('@a11y Check Box page - WCAG 2.1 AA', async ({ page }) => {
      await page.goto(`${process.env.DEMOQA_BASE_URL ?? 'https://demoqa.com'}/checkbox`);
      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    });
  });
});