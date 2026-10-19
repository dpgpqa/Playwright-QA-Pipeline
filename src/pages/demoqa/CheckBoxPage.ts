import { BasePage } from '../BasePage';

export class CheckBoxPage extends BasePage {
  protected readonly path = '/checkbox';

  private readonly expandAll = this.page.getByTitle('Expand all');
  private readonly collapseAll = this.page.getByTitle('Collapse all');
  private readonly result = this.page.locator('#result');
  private readonly treeItems = this.page.locator('.rct-node');

  async waitForLoad(): Promise<void> {
    await this.expandAll.waitFor({ state: 'visible' });
  }

  async expandAllNodes(): Promise<void> {
    await this.expandAll.click();
  }

  async collapseAllNodes(): Promise<void> {
    await this.collapseAll.click();
  }

  async toggleNode(label: string): Promise<void> {
    const node = this.page.locator('.rct-node', { hasText: label });
    const toggle = node.locator('.rct-collapse-btn');
    await toggle.click();
  }

  async checkNode(label: string): Promise<void> {
    const node = this.page.locator('.rct-node', { hasText: label });
    const checkbox = node.locator('.rct-checkbox');
    if (!(await checkbox.locator('input').isChecked())) {
      await checkbox.click();
    }
  }

  async uncheckNode(label: string): Promise<void> {
    const node = this.page.locator('.rct-node', { hasText: label });
    const checkbox = node.locator('.rct-checkbox');
    if (await checkbox.locator('input').isChecked()) {
      await checkbox.click();
    }
  }

  async getResult(): Promise<string[]> {
    await this.result.waitFor({ state: 'visible' });
    return this.page.locator('.text-success').allTextContents();
  }
}
