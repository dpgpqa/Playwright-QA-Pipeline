import { BasePage } from '../BasePage';

export class RadioButtonPage extends BasePage {
  protected readonly path = '/radio-button';

  private readonly yesRadio = this.page.locator('label[for="yesRadio"]');
  private readonly impressiveRadio = this.page.locator('label[for="impressiveRadio"]');
  private readonly noRadio = this.page.locator('label[for="noRadio"]');
  private readonly result = this.page.locator('.text-success');

  async waitForLoad(): Promise<void> {
    await this.yesRadio.waitFor({ state: 'visible' });
  }

  async selectYes(): Promise<void> {
    await this.yesRadio.click();
  }

  async selectImpressive(): Promise<void> {
    await this.impressiveRadio.click();
  }

  async getResult(): Promise<string> {
    await this.result.waitFor({ state: 'visible' });
    return (await this.result.textContent()) ?? '';
  }

  async isSelected(label: string): Promise<boolean> {
    const radio = this.page.locator(`label[for="${label}Radio"]`);
    return radio.locator('input').isChecked();
  }
}
