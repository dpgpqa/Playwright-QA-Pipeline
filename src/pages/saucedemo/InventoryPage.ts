import { BasePage } from '../BasePage';

export class InventoryPage extends BasePage {
  protected readonly path = '/inventory.html';

  private readonly inventoryList = this.page.locator('.inventory_list');
  private readonly inventoryItems = this.page.locator('.inventory_item');
  private readonly cartBadge = this.page.getByTestId('shopping-cart-badge');
  private readonly cartLink = this.page.getByTestId('shopping-cart-link');
  private readonly menuButton = this.page.getByTestId('open-menu');
  private readonly logoutLink = this.page.getByTestId('logout-sidebar-link');
  private readonly resetLink = this.page.getByTestId('reset-sidebar-link');

  async waitForLoad(): Promise<void> {
    await this.inventoryList.waitFor({ state: 'visible' });
  }

  async isLoaded(): Promise<boolean> {
    return this.inventoryList.isVisible();
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async addItemToCart(itemName: string): Promise<void> {
    const item = this.page.locator('.inventory_item', { hasText: itemName });
    await item.getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeItemFromCart(itemName: string): Promise<void> {
    const item = this.page.locator('.inventory_item', { hasText: itemName });
    await item.getByRole('button', { name: 'Remove' }).click();
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

  async isItemInCart(itemName: string): Promise<boolean> {
    const item = this.page.locator('.inventory_item', { hasText: itemName });
    const button = item.getByRole('button', { name: 'Remove' });
    return button.isVisible();
  }
}
