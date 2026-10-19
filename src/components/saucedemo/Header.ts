import { Page } from '@playwright/test';

export class Header {
  constructor(private readonly page: Page) {}

  private readonly menuButton = this.page.getByTestId('open-menu');
  private readonly cartBadge = this.page.getByTestId('shopping-cart-badge');
  private readonly cartLink = this.page.getByTestId('shopping-cart-link');
  private readonly logoutLink = this.page.getByTestId('logout-sidebar-link');
  private readonly resetLink = this.page.getByTestId('reset-sidebar-link');
  private readonly aboutLink = this.page.getByTestId('about-sidebar-link');

  async getCartCount(): Promise<number> {
    const badge = await this.cartBadge.textContent();
    return badge ? parseInt(badge, 10) : 0;
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
    await this.page.waitForURL('**/cart.html');
  }

  async openMenu(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutLink.click();
    await this.page.waitForURL('**/');
  }

  async resetAppState(): Promise<void> {
    await this.openMenu();
    await this.resetLink.click();
  }

  async goToAbout(): Promise<void> {
    await this.openMenu();
    await this.aboutLink.click();
    await this.page.waitForURL('**/saucelabs.com/**');
  }
}
