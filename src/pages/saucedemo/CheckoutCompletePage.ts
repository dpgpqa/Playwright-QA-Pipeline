import { BasePage } from '../BasePage';

export class CheckoutCompletePage extends BasePage {
  protected readonly path = '/checkout-complete.html';

  private readonly completeHeader = this.page.locator('.complete-header');
  private readonly completeText = this.page.locator('.complete-text');
  private readonly backHomeButton = this.page.getByTestId('back-to-products');

  async waitForLoad(): Promise<void> {
    await this.completeHeader.waitFor({ state: 'visible' });
  }

  async getSuccessMessage(): Promise<string> {
    return (await this.completeHeader.textContent()) ?? '';
  }

  async getCompleteText(): Promise<string> {
    return (await this.completeText.textContent()) ?? '';
  }

  async backToProducts(): Promise<void> {
    await this.backHomeButton.click();
    await this.page.waitForURL('**/inventory.html');
  }

  async isOrderComplete(): Promise<boolean> {
    const header = await this.getSuccessMessage();
    return header.toLowerCase().includes('thank you');
  }
}
