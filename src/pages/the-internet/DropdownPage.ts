import { BasePage } from '../BasePage';

export class DropdownPage extends BasePage {
  protected readonly path = '/dropdown';

  private readonly dropdown = this.page.locator('#dropdown');
  private readonly header = this.page.locator('h3');

  async waitForLoad(): Promise<void> {
    await this.header.waitFor({ state: 'visible' });
  }

  async getOptions(): Promise<string[]> {
    return this.dropdown.locator('option').allTextContents();
  }

  async selectByValue(value: string): Promise<void> {
    await this.dropdown.selectOption(value);
  }

  async selectByLabel(label: string): Promise<void> {
    await this.dropdown.selectOption({ label });
  }

  async selectByIndex(index: number): Promise<void> {
    await this.dropdown.selectOption({ index });
  }

  async getSelectedValue(): Promise<string> {
    return (await this.dropdown.inputValue()) ?? '';
  }
}
