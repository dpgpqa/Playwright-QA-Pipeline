import { BasePage } from '../BasePage';

export class CheckoutInfoPage extends BasePage {
  protected readonly path = '/checkout-step-one.html';

  private readonly firstName = this.page.getByTestId('firstName');
  private readonly lastName = this.page.getByTestId('lastName');
  private readonly postalCode = this.page.getByTestId('postalCode');
  private readonly continueButton = this.page.getByTestId('continue');
  private readonly cancelButton = this.page.getByTestId('cancel');
  private readonly error = this.page.getByTestId('error');

  async waitForLoad(): Promise<void> {
    await this.firstName.waitFor({ state: 'visible' });
  }

  async fillInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.postalCode.fill(postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
    await this.page.waitForURL('**/checkout-step-two.html');
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
    await this.page.waitForURL('**/cart.html');
  }

  async getErrorMessage(): Promise<string> {
    return (await this.error.textContent()) ?? '';
  }
}
