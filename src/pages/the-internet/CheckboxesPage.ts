import { BasePage } from '../BasePage';

export class CheckboxesPage extends BasePage {
  protected readonly path = '/checkboxes';

  private readonly checkboxes = this.page.locator('input[type="checkbox"]');
  private readonly header = this.page.locator('h3');

  async waitForLoad(): Promise<void> {
    await this.header.waitFor({ state: 'visible' });
  }

  async getCheckboxCount(): Promise<number> {
    return this.checkboxes.count();
  }

  async isChecked(index: number): Promise<boolean> {
    return this.checkboxes.nth(index).isChecked();
  }

  async check(index: number): Promise<void> {
    const checkbox = this.checkboxes.nth(index);
    if (!(await checkbox.isChecked())) {
      await checkbox.check();
    }
  }

  async uncheck(index: number): Promise<void> {
    const checkbox = this.checkboxes.nth(index);
    if (await checkbox.isChecked()) {
      await checkbox.uncheck();
    }
  }

  async toggle(index: number): Promise<void> {
    const checkbox = this.checkboxes.nth(index);
    await checkbox.click();
  }
}
