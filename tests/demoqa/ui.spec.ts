import { test, expect } from '@fixtures/base.fixture';

test.describe('DemoQA - UI Component Tests', () => {
  test.describe('Text Box', () => {
    test.beforeEach(async ({ textBoxPage }) => {
      await textBoxPage.goto();
    });

    test('@regression Fill and submit form', async ({ textBoxPage }) => {
      const formData = {
        userName: 'John Doe',
        userEmail: 'john.doe@example.com',
        currentAddress: '123 Main St, New York, NY 10001',
        permanentAddress: '456 Oak Ave, Los Angeles, CA 90001',
      };

      await textBoxPage.fillForm(formData);
      await textBoxPage.submit();

      const output = await textBoxPage.getOutput();
      expect(output.name).toBe(formData.userName);
      expect(output.email).toBe(formData.userEmail);
      expect(output.currentAddress).toBe(formData.currentAddress);
      expect(output.permanentAddress).toBe(formData.permanentAddress);
    });

    test('@regression Form validation - empty fields', async ({ textBoxPage }) => {
      await textBoxPage.submit();
      // Form should not submit with empty required fields
      const output = await textBoxPage.page.locator('#output');
      await expect(output).toBeHidden();
    });
  });

  test.describe('Check Box', () => {
    test.beforeEach(async ({ checkBoxPage }) => {
      await checkBoxPage.goto();
    });

    test('@regression Expand all and check Home', async ({ checkBoxPage }) => {
      await checkBoxPage.expandAllNodes();
      await checkBoxPage.checkNode('Home');
      const result = await checkBoxPage.getResult();
      expect(result).toContain('home');
      expect(result).toContain('desktop');
      expect(result).toContain('notes');
      expect(result).toContain('commands');
      expect(result).toContain('documents');
      expect(result).toContain('workspace');
      expect(result).toContain('react');
      expect(result).toContain('angular');
      expect(result).toContain('veu');
      expect(result).toContain('office');
      expect(result).toContain('public');
      expect(result).toContain('private');
      expect(result).toContain('classified');
      expect(result).toContain('general');
      expect(result).toContain('downloads');
      expect(result).toContain('wordFile');
      expect(result).toContain('excelFile');
    });

    test('@regression Check specific node', async ({ checkBoxPage }) => {
      await checkBoxPage.expandAllNodes();
      await checkBoxPage.checkNode('Documents');
      const result = await checkBoxPage.getResult();
      expect(result).toContain('documents');
      expect(result).toContain('workspace');
      expect(result).toContain('react');
      expect(result).toContain('angular');
      expect(result).toContain('veu');
      expect(result).toContain('office');
      expect(result).toContain('public');
      expect(result).toContain('private');
      expect(result).toContain('classified');
      expect(result).toContain('general');
    });

    test('@regression Collapse all', async ({ checkBoxPage }) => {
      await checkBoxPage.expandAllNodes();
      await checkBoxPage.collapseAllNodes();
      // After collapse, only Home should be visible at top level
    });

    test('@regression Toggle node', async ({ checkBoxPage }) => {
      await checkBoxPage.toggleNode('Home');
      await checkBoxPage.toggleNode('Home');
    });
  });

  test.describe('Radio Button', () => {
    test.beforeEach(async ({ radioButtonPage }) => {
      await radioButtonPage.goto();
    });

    test('@regression Select Yes radio', async ({ radioButtonPage }) => {
      await radioButtonPage.selectYes();
      const result = await radioButtonPage.getResult();
      expect(result).toBe('Yes');
    });

    test('@regression Select Impressive radio', async ({ radioButtonPage }) => {
      await radioButtonPage.selectImpressive();
      const result = await radioButtonPage.getResult();
      expect(result).toBe('Impressive');
    });

    test('@regression No radio is disabled', async ({ radioButtonPage }) => {
      const noRadio = radioButtonPage.page.locator('#noRadio');
      await expect(noRadio).toBeDisabled();
    });
  });

  test.describe('Web Tables', () => {
    test.beforeEach(async ({ webTablesPage }) => {
      await webTablesPage.goto();
    });

    test('@regression Initial table has data', async ({ webTablesPage }) => {
      const count = await webTablesPage.getRowCount();
      expect(count).toBeGreaterThan(0);
    });

    test('@regression Add new record', async ({ webTablesPage }) => {
      const initialCount = await webTablesPage.getRowCount();
      const newRecord = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test.user@example.com',
        age: '25',
        salary: '50000',
        department: 'QA',
      };

      await webTablesPage.addRecord(newRecord);
      const newCount = await webTablesPage.getRowCount();
      expect(newCount).toBe(initialCount + 1);

      // Verify the record was added
      const lastRow = await webTablesPage.getRowData(newCount - 1);
      expect(lastRow?.firstName).toBe(newRecord.firstName);
      expect(lastRow?.lastName).toBe(newRecord.lastName);
      expect(lastRow?.email).toBe(newRecord.email);
    });

    test('@regression Search records', async ({ webTablesPage }) => {
      await webTablesPage.search('Cierra');
      const count = await webTablesPage.getRowCount();
      if (count > 0) {
        const row = await webTablesPage.getRowData(0);
        expect(row?.firstName).toContain('Cierra');
      }
      await webTablesPage.clearSearch();
    });

    test('@regression Edit record', async ({ webTablesPage }) => {
      const initialCount = await webTablesPage.getRowCount();
      if (initialCount > 0) {
        await webTablesPage.editRecord(0, { firstName: 'Updated' });
        const row = await webTablesPage.getRowData(0);
        expect(row?.firstName).toBe('Updated');
      }
    });

    test('@regression Delete record', async ({ webTablesPage }) => {
      const initialCount = await webTablesPage.getRowCount();
      if (initialCount > 0) {
        await webTablesPage.deleteRecord(0);
        const newCount = await webTablesPage.getRowCount();
        expect(newCount).toBe(initialCount - 1);
      }
    });

    test('@regression Close modal without submitting', async ({ webTablesPage }) => {
      await webTablesPage.addButton.click();
      await webTablesPage.registrationForm.waitFor({ state: 'visible' });
      await webTablesPage.closeModal();
      await webTablesPage.registrationForm.waitFor({ state: 'hidden' });
    });
  });
});