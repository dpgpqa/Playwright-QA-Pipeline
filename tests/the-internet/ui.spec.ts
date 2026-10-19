import { test, expect } from '@fixtures/base.fixture';

test.describe('The Internet - UI Component Tests', () => {
  test.describe('Login', () => {
    test.beforeEach(async ({ internetLoginPage }) => {
      await internetLoginPage.goto();
    });

    test('@regression Valid login', async ({ internetLoginPage }) => {
      await internetLoginPage.login('tomsmith', 'SuperSecretPassword!');
      expect(await internetLoginPage.isLoggedIn()).toBeTruthy();
      const flash = await internetLoginPage.getFlashMessage();
      expect(flash).toContain('You logged into a secure area');
    });

    test('@regression Invalid username', async ({ internetLoginPage }) => {
      await internetLoginPage.login('invalid', 'SuperSecretPassword!');
      const flash = await internetLoginPage.getFlashMessage();
      expect(flash).toContain('Your username is invalid');
    });

    test('@regression Invalid password', async ({ internetLoginPage }) => {
      await internetLoginPage.login('tomsmith', 'invalid');
      const flash = await internetLoginPage.getFlashMessage();
      expect(flash).toContain('Your password is invalid');
    });

    test('@regression Logout works', async ({ internetLoginPage }) => {
      await internetLoginPage.login('tomsmith', 'SuperSecretPassword!');
      await internetLoginPage.logout();
      expect(await internetLoginPage.getPage().url()).toContain('/login');
    });
  });

  test.describe('Checkboxes', () => {
    test.beforeEach(async ({ checkboxesPage }) => {
      await checkboxesPage.goto();
    });

    test('@regression Checkbox 1 initially unchecked, checkbox 2 checked', async ({ checkboxesPage }) => {
      expect(await checkboxesPage.isChecked(0)).toBeFalsy();
      expect(await checkboxesPage.isChecked(1)).toBeTruthy();
    });

    test('@regression Can check checkbox 1', async ({ checkboxesPage }) => {
      await checkboxesPage.check(0);
      expect(await checkboxesPage.isChecked(0)).toBeTruthy();
    });

    test('@regression Can uncheck checkbox 2', async ({ checkboxesPage }) => {
      await checkboxesPage.uncheck(1);
      expect(await checkboxesPage.isChecked(1)).toBeFalsy();
    });

    test('@regression Can toggle checkboxes', async ({ checkboxesPage }) => {
      await checkboxesPage.toggle(0);
      expect(await checkboxesPage.isChecked(0)).toBeTruthy();
      await checkboxesPage.toggle(0);
      expect(await checkboxesPage.isChecked(0)).toBeFalsy();
    });
  });

  test.describe('Dropdown', () => {
    test.beforeEach(async ({ dropdownPage }) => {
      await dropdownPage.goto();
    });

    test('@regression Has correct options', async ({ dropdownPage }) => {
      const options = await dropdownPage.getOptions();
      expect(options).toContain('Please select an option');
      expect(options).toContain('Option 1');
      expect(options).toContain('Option 2');
    });

    test('@regression Select by value', async ({ dropdownPage }) => {
      await dropdownPage.selectByValue('1');
      expect(await dropdownPage.getSelectedValue()).toBe('1');
    });

    test('@regression Select by label', async ({ dropdownPage }) => {
      await dropdownPage.selectByLabel('Option 2');
      expect(await dropdownPage.getSelectedValue()).toBe('2');
    });

    test('@regression Select by index', async ({ dropdownPage }) => {
      await dropdownPage.selectByIndex(1);
      expect(await dropdownPage.getSelectedValue()).toBe('1');
    });
  });

  test.describe('Dynamic Loading', () => {
    test.beforeEach(async ({ dynamicLoadingPage }) => {
      await dynamicLoadingPage.goto();
    });

    test('@regression Example 1 - hidden element appears', async ({ dynamicLoadingPage }) => {
      await dynamicLoadingPage.goToExample1();
      await dynamicLoadingPage.startLoading();
      const text = await dynamicLoadingPage.waitForFinish();
      expect(text).toContain('Hello World');
    });

    test('@regression Example 2 - element rendered after fact', async ({ dynamicLoadingPage }) => {
      await dynamicLoadingPage.goToExample2();
      await dynamicLoadingPage.startLoading();
      const text = await dynamicLoadingPage.waitForFinish();
      expect(text).toContain('Hello World');
    });
  });

  test.describe('File Upload', () => {
    test.beforeEach(async ({ fileUploadPage }) => {
      await fileUploadPage.goto();
    });

    test('@regression Upload file', async ({ fileUploadPage }) => {
      const testFile = 'test-data/upload-test.txt';
      await fileUploadPage.uploadFile(testFile);
      const uploadedName = await fileUploadPage.getUploadedFileName();
      expect(uploadedName).toBe('upload-test.txt');
    });
  });
});