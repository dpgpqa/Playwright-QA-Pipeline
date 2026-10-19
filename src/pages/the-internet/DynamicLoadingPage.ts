import { BasePage } from '../BasePage';

export class DynamicLoadingPage extends BasePage {
  protected readonly path = '/dynamic_loading';

  private readonly example1Link = this.page.getByRole('link', { name: 'Example 1: Element on page that is hidden' });
  private readonly example2Link = this.page.getByRole('link', { name: 'Example 2: Element rendered after the fact' });
  private readonly startButton = this.page.getByRole('button', { name: 'Start' });
  private readonly finishText = this.page.locator('#finish');
  private readonly loadingIndicator = this.page.locator('#loading');

  async waitForLoad(): Promise<void> {
    await this.example1Link.waitFor({ state: 'visible' });
  }

  async goToExample1(): Promise<void> {
    await this.example1Link.click();
    await this.page.waitForURL('**/dynamic_loading/1');
  }

  async goToExample2(): Promise<void> {
    await this.example2Link.click();
    await this.page.waitForURL('**/dynamic_loading/2');
  }

  async startLoading(): Promise<void> {
    await this.startButton.click();
  }

  async waitForFinish(timeout = 10000): Promise<string> {
    await this.finishText.waitFor({ state: 'visible', timeout });
    return (await this.finishText.textContent()) ?? '';
  }

  async isLoadingVisible(): Promise<boolean> {
    return this.loadingIndicator.isVisible();
  }
}
