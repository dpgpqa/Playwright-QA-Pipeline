import { BasePage } from '../BasePage';

export class WebTablesPage extends BasePage {
  protected readonly path = '/webtables';

  private readonly addButton = this.page.locator('#addNewRecordButton');
  private readonly searchBox = this.page.locator('#searchBox');
  private readonly tableRows = this.page.locator('.rt-tbody .rt-tr-group');
  private readonly noRowsMessage = this.page.locator('.rt-noData');
  private readonly registrationForm = this.page.locator('#registration-form-modal');
  private readonly firstName = this.page.locator('#firstName');
  private readonly lastName = this.page.locator('#lastName');
  private readonly userEmail = this.page.locator('#userEmail');
  private readonly age = this.page.locator('#age');
  private readonly salary = this.page.locator('#salary');
  private readonly department = this.page.locator('#department');
  private readonly submit = this.page.locator('#submit');
  private readonly closeButton = this.page.locator('#closeLargeModal');

  async waitForLoad(): Promise<void> {
    await this.addButton.waitFor({ state: 'visible' });
  }

  async getRowCount(): Promise<number> {
    const count = await this.tableRows.count();
    // Check if "No rows found" message is visible
    if (await this.noRowsMessage.isVisible()) return 0;
    return count;
  }

  async getRowData(index: number): Promise<{
    firstName: string;
    lastName: string;
    age: string;
    email: string;
    salary: string;
    department: string;
  } | null> {
    const row = this.tableRows.nth(index);
    const cells = row.locator('.rt-td');
    const cellCount = await cells.count();
    if (cellCount < 7) return null;

    return {
      firstName: (await cells.nth(0).textContent()) ?? '',
      lastName: (await cells.nth(1).textContent()) ?? '',
      age: (await cells.nth(2).textContent()) ?? '',
      email: (await cells.nth(3).textContent()) ?? '',
      salary: (await cells.nth(4).textContent()) ?? '',
      department: (await cells.nth(5).textContent()) ?? '',
    };
  }

  async search(term: string): Promise<void> {
    await this.searchBox.fill(term);
  }

  async clearSearch(): Promise<void> {
    await this.searchBox.clear();
  }

  async addRecord(data: {
    firstName: string;
    lastName: string;
    email: string;
    age: string;
    salary: string;
    department: string;
  }): Promise<void> {
    await this.addButton.click();
    await this.registrationForm.waitFor({ state: 'visible' });
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.userEmail.fill(data.email);
    await this.age.fill(data.age);
    await this.salary.fill(data.salary);
    await this.department.fill(data.department);
    await this.submit.click();
    await this.registrationForm.waitFor({ state: 'hidden' });
  }

  async editRecord(index: number, data: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    age: string;
    salary: string;
    department: string;
  }>): Promise<void> {
    const row = this.tableRows.nth(index);
    const editButton = row.locator('span[title="Edit"]');
    await editButton.click();
    await this.registrationForm.waitFor({ state: 'visible' });

    if (data.firstName) await this.firstName.fill(data.firstName);
    if (data.lastName) await this.lastName.fill(data.lastName);
    if (data.email) await this.userEmail.fill(data.email);
    if (data.age) await this.age.fill(data.age);
    if (data.salary) await this.salary.fill(data.salary);
    if (data.department) await this.department.fill(data.department);

    await this.submit.click();
    await this.registrationForm.waitFor({ state: 'hidden' });
  }

  async deleteRecord(index: number): Promise<void> {
    const row = this.tableRows.nth(index);
    const deleteButton = row.locator('span[title="Delete"]');
    await deleteButton.click();
  }

  async closeModal(): Promise<void> {
    await this.closeButton.click();
    await this.registrationForm.waitFor({ state: 'hidden' });
  }

  async openModal(): Promise<void> {
    await this.addButton.click();
    await this.registrationForm.waitFor({ state: 'visible' });
  }
}
