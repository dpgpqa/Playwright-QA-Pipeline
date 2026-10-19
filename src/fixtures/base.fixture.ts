import { test as base, type Page } from '@playwright/test';
import { LoginPage } from '@pages/saucedemo/LoginPage';
import { InventoryPage } from '@pages/saucedemo/InventoryPage';
import { CartPage } from '@pages/saucedemo/CartPage';
import { CheckoutInfoPage } from '@pages/saucedemo/CheckoutInfoPage';
import { CheckoutOverviewPage } from '@pages/saucedemo/CheckoutOverviewPage';
import { CheckoutCompletePage } from '@pages/saucedemo/CheckoutCompletePage';
import { Header } from '@components/saucedemo/Header';
import { LoginPage as InternetLoginPage } from '@pages/the-internet/LoginPage';
import { CheckboxesPage } from '@pages/the-internet/CheckboxesPage';
import { DropdownPage } from '@pages/the-internet/DropdownPage';
import { DynamicLoadingPage } from '@pages/the-internet/DynamicLoadingPage';
import { FileUploadPage } from '@pages/the-internet/FileUploadPage';
import { TextBoxPage } from '@pages/demoqa/TextBoxPage';
import { CheckBoxPage } from '@pages/demoqa/CheckBoxPage';
import { RadioButtonPage } from '@pages/demoqa/RadioButtonPage';
import { WebTablesPage } from '@pages/demoqa/WebTablesPage';

type SauceDemoFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
  header: Header;
};

type InternetFixtures = {
  internetLoginPage: InternetLoginPage;
  checkboxesPage: CheckboxesPage;
  dropdownPage: DropdownPage;
  dynamicLoadingPage: DynamicLoadingPage;
  fileUploadPage: FileUploadPage;
};

type DemoQAFixtures = {
  textBoxPage: TextBoxPage;
  checkBoxPage: CheckBoxPage;
  radioButtonPage: RadioButtonPage;
  webTablesPage: WebTablesPage;
};

type WorkerFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<SauceDemoFixtures & InternetFixtures & DemoQAFixtures & WorkerFixtures>({
  // SauceDemo fixtures
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  checkoutInfoPage: async ({ page }, use) => {
    const checkoutInfoPage = new CheckoutInfoPage(page);
    await use(checkoutInfoPage);
  },

  checkoutOverviewPage: async ({ page }, use) => {
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    await use(checkoutOverviewPage);
  },

  checkoutCompletePage: async ({ page }, use) => {
    const checkoutCompletePage = new CheckoutCompletePage(page);
    await use(checkoutCompletePage);
  },

  header: async ({ page }, use) => {
    const header = new Header(page);
    await use(header);
  },

  // The Internet fixtures
  internetLoginPage: async ({ page }, use) => {
    const internetLoginPage = new InternetLoginPage(page);
    await use(internetLoginPage);
  },

  checkboxesPage: async ({ page }, use) => {
    const checkboxesPage = new CheckboxesPage(page);
    await use(checkboxesPage);
  },

  dropdownPage: async ({ page }, use) => {
    const dropdownPage = new DropdownPage(page);
    await use(dropdownPage);
  },

  dynamicLoadingPage: async ({ page }, use) => {
    const dynamicLoadingPage = new DynamicLoadingPage(page);
    await use(dynamicLoadingPage);
  },

  fileUploadPage: async ({ page }, use) => {
    const fileUploadPage = new FileUploadPage(page);
    await use(fileUploadPage);
  },

  // DemoQA fixtures
  textBoxPage: async ({ page }, use) => {
    const textBoxPage = new TextBoxPage(page);
    await use(textBoxPage);
  },

  checkBoxPage: async ({ page }, use) => {
    const checkBoxPage = new CheckBoxPage(page);
    await use(checkBoxPage);
  },

  radioButtonPage: async ({ page }, use) => {
    const radioButtonPage = new RadioButtonPage(page);
    await use(radioButtonPage);
  },

  webTablesPage: async ({ page }, use) => {
    const webTablesPage = new WebTablesPage(page);
    await use(webTablesPage);
  },

  // Worker-scoped authenticated page (for SauceDemo)
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAndWaitForInventory(
      process.env.SAUCEDEMO_USERNAME ?? 'standard_user',
      process.env.SAUCEDEMO_PASSWORD ?? 'secret_sauce'
    );
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
