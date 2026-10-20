import { test as base, selectors } from '@playwright/test';
import type { Page, Browser } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { Header } from '../components/Header';
import { getUser } from '../utils/testData';

type AppFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
  header: Header;
  freshContextPage: Page;
};

type WorkerFixtures = {
  workerStorageState: string;
};

/**
 * Worker-scoped auth — each Playwright worker performs one login at startup and
 * writes its own storage state file. Tests within a worker share that session;
 * tests in different workers never share a session. This prevents the kind of
 * cross-test session collisions you hit when one global `auth.json` is reused
 * across many concurrent contexts (rate limits, sticky locks, CSRF nonces).
 */
export const test = base.extend<AppFixtures, WorkerFixtures>({
  workerStorageState: [
    async (
      { browser }: { browser: Browser },
      use: (arg: string) => Promise<void>,
      workerInfo: {
        workerIndex: number;
        project: { use: { testIdAttribute?: string; baseURL?: string } };
      }
    ) => {
      const file = path.resolve(process.cwd(), '.auth', `user-${workerInfo.workerIndex}.json`);
      if (!fs.existsSync(file)) {
        fs.mkdirSync(path.dirname(file), { recursive: true });
        // Worker fixtures run before per-test setup applies use.testIdAttribute,
        // so set it explicitly to match the project config.
        const testIdAttribute = workerInfo.project.use.testIdAttribute;
        if (testIdAttribute) selectors.setTestIdAttribute(testIdAttribute);
        // newContext doesn't inherit `use.baseURL` from the project config,
        // so we pass it explicitly so loginPage.goto('/') resolves correctly.
        const context = await browser.newContext({
          storageState: undefined,
          baseURL: workerInfo.project.use.baseURL,
        });
        const page = await context.newPage();
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        const user = getUser('standard');
        await loginPage.goto();
        await loginPage.loginAndWaitForInventory(user.username, user.password);
        await inventoryPage.waitForLoad();
        await context.storageState({ path: file });
        await context.close();
      }
      await use(file);
    },
    { scope: 'worker' },
  ],

  // Override Playwright's built-in storageState option to point at the per-worker file.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

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
  freshContextPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
