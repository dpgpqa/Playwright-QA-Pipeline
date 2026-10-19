import { BasePage } from '../BasePage';

export class CartPage extends BasePage {
  protected readonly path = '/cart.html';

  private readonly cartList = this.page.locator('.cart_list');
  private readonly cartItems = this.page.locator('.cart_item');
  private readonly checkoutButton = this.page.getByTestId('checkout');
  private readonly continueShoppingButton = this.page.getByTestId('continue-shopping');

  async waitForLoad(): Promise<void> {
    await this.cartList.waitFor({ state: 'visible' });
  }

  async getCartItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async removeItem(itemName: string): Promise<void> {
    const item = this.page.locator('.cart_item', { hasText: itemName });
    await item.getByRole('button', { name: 'Remove' }).click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
    await this.page.waitForURL('**/checkout-step-one.html');
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
    await this.page.waitForURL('**/inventory.html');
  }

  async getItemQuantity(itemName: string): Promise<number> {
    const item = this.page.locator('.cart_item', { hasText: itemName });
    const qty = await item.locator('.cart_quantity').textContent();
    return qty ? parseInt(qty, 10) : 0;
  }

  async getItemPrice(itemName: string): Promise<number> {
    const item = this.page.locator('.cart_item', { hasText: itemName });
    const priceText = await item.locator('.inventory_item_price').textContent();
    return priceText ? parseFloat(priceText.replace('$', '')) : 0;
  }
}
