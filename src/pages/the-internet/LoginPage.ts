import { BasePage } from '../BasePage';

export class LoginPage extends BasePage {
  protected readonly path = '/login';

  private readonly username = this.page.getByLabel('Username');
  private readonly password = this.page.getByLabel('Password');
  private readonly submit = this.page.getByRole('button', { name: 'Login' });
  private readonly flash = this.page.locator('#flash');
  private readonly logoutButton = this.page.getByRole('button', { name: 'Logout' });

  async waitForLoad(): Promise<void> {
    await this.username.waitFor({ state: 'visible' });
  }

  async login(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submit.click();
  }

  async getFlashMessage(): Promise<string> {
    return (await this.flash.textContent()) ?? '';
  }

  async isLoggedIn(): Promise<boolean> {
    return this.logoutButton.isVisible();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
    await this.page.waitForURL('**/login');
  }
}
