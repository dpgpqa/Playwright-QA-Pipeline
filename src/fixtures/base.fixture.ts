import { test as base, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '@pages/saucedemo/LoginPage';
import { InventoryPage } from '@pages/saucedemo/InventoryPage';
import { CartPage } from '@pages/saucedemo/CartPage';
import { CheckoutInfoPage } from '@pages/saucedemo/CheckoutInfoPage';
import { CheckoutOverviewPage } from '@pages/saucedemo/CheckoutOverviewPage';
import { CheckoutCompletePage } from '@pages/saucedemo/CheckoutCompletePage';
import { Header } from '@components/saucedemo/Header';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

type SauceDemoFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
  header: Header;
};

type WorkerFixtures = {
  authenticatedPage: Page;
  freshContextPage: Page;
};

type AllFixtures = SauceDemoFixtures & WorkerFixtures;

const extendedTest = base.extend<AllFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutInfoPage: async ({ page }, use) => {
    await use(new CheckoutInfoPage(page));
  },

  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },

  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },

  header: async ({ page }, use) => {
    await use(new Header(page));
  },

  authenticatedPage: async ({ browser }, use, workerInfo) => {
    const authDir = join(process.cwd(), '.auth');
    const workerAuthFile = join(authDir, `user-${workerInfo.workerIndex}.json`);

    if (!existsSync(authDir)) {
      mkdirSync(authDir, { recursive: true });
    }

    let context: BrowserContext;
    if (process.env.PW_KEEP_AUTH === '1' && existsSync(workerAuthFile)) {
      context = await browser.newContext({ storageState: workerAuthFile });
    } else {
      context = await browser.newContext();
      const page = await context.newPage();
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.loginAndWaitForInventory(
        process.env.TEST_USER_USERNAME ?? 'standard_user',
        process.env.TEST_USER_PASSWORD ?? 'secret_sauce'
      );
      await context.storageState({ path: workerAuthFile });
    }

    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  freshContextPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

const testWithReset = extendedTest.extend<{ page: Page }>({
  page: async ({ page }, use, testInfo) => {
    await use(page);

    const usesAuth =
      testInfo.title.includes('@smoke') ||
      testInfo.title.includes('@regression') ||
      testInfo.title.includes('@api') ||
      testInfo.title.includes('@a11y') ||
      testInfo.title.includes('@visual');

    if (usesAuth) {
      try {
        const header = new Header(page);
        await header.resetAppState();
      } catch {
        // Ignore reset failures
      }
    }
  },
});

export const test = testWithReset;

export { expect } from '@playwright/test';
