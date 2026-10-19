import { BasePage } from '../BasePage';

export class CheckoutOverviewPage extends BasePage {
  protected readonly path = '/checkout-step-two.html';

  private readonly overviewItems = this.page.locator('.cart_item');
  private readonly finishButton = this.page.getByTestId('finish');
  private readonly cancelButton = this.page.getByTestId('cancel');
  private readonly summarySubtotal = this.page.locator('.summary_subtotal_label');
  private readonly summaryTax = this.page.locator('.summary_tax_label');
  private readonly summaryTotal = this.page.locator('.summary_total_label');

  async waitForLoad(): Promise<void> {
    await this.overviewItems.first().waitFor({ state: 'visible' });
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getSubtotal(): Promise<number> {
    const text = await this.summarySubtotal.textContent();
    return text ? parseFloat(text.replace('Item total: $', '')) : 0;
  }

  async getTax(): Promise<number> {
    const text = await this.summaryTax.textContent();
    return text ? parseFloat(text.replace('Tax: $', '')) : 0;
  }

  async getTotal(): Promise<number> {
    const text = await this.summaryTotal.textContent();
    return text ? parseFloat(text.replace('Total: $', '')) : 0;
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
    await this.page.waitForURL('**/checkout-complete.html');
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
    await this.page.waitForURL('**/cart.html');
  }
}
