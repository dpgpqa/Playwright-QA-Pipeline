import { BasePage } from '../BasePage';

export class TextBoxPage extends BasePage {
  protected readonly path = '/text-box';

  private readonly userName = this.page.locator('#userName');
  private readonly userEmail = this.page.locator('#userEmail');
  private readonly currentAddress = this.page.locator('#currentAddress');
  private readonly permanentAddress = this.page.locator('#permanentAddress');
  private readonly submit = this.page.locator('#submit');
  private readonly output = this.page.locator('#output');
  private readonly outputName = this.page.locator('#name');
  private readonly outputEmail = this.page.locator('#email');
  private readonly outputCurrentAddress = this.page.locator('#currentAddress');
  private readonly outputPermanentAddress = this.page.locator('#permanentAddress');

  async waitForLoad(): Promise<void> {
    await this.userName.waitFor({ state: 'visible' });
  }

  async fillForm(data: {
    userName: string;
    userEmail: string;
    currentAddress: string;
    permanentAddress: string;
  }): Promise<void> {
    await this.userName.fill(data.userName);
    await this.userEmail.fill(data.userEmail);
    await this.currentAddress.fill(data.currentAddress);
    await this.permanentAddress.fill(data.permanentAddress);
  }

  async submit(): Promise<void> {
    await this.submit.click();
  }

  async getOutput(): Promise<{
    name: string;
    email: string;
    currentAddress: string;
    permanentAddress: string;
  }> {
    await this.output.waitFor({ state: 'visible' });
    return {
      name: (await this.outputName.textContent())?.replace('Name:', '').trim() ?? '',
      email: (await this.outputEmail.textContent())?.replace('Email:', '').trim() ?? '',
      currentAddress: (await this.outputCurrentAddress.textContent())?.replace('Current Address:', '').trim() ?? '',
      permanentAddress: (await this.outputPermanentAddress.textContent())?.replace('Permanent Address:', '').trim() ?? '',
    };
  }
}
