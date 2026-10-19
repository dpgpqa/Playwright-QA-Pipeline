import type { Page } from '@playwright/test';

export class Header {
  private readonly menuButton: ReturnType<Page['getByTestId']>;
  private readonly cartBadge: ReturnType<Page['getByTestId']>;
  private readonly cartLink: ReturnType<Page['getByTestId']>;
  private readonly logoutLink: ReturnType<Page['getByTestId']>;
  private readonly resetLink: ReturnType<Page['getByTestId']>;
  private readonly aboutLink: ReturnType<Page['getByTestId']>;

  constructor(private readonly page: Page) {
    this.menuButton = page.getByTestId('open-menu');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.logoutLink = page.getByTestId('logout-sidebar-link');
    this.resetLink = page.getByTestId('reset-sidebar-link');
    this.aboutLink = page.getByTestId('about-sidebar-link');
  }

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
