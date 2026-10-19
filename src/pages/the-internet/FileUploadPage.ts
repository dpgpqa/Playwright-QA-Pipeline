import { BasePage } from '../BasePage';

export class FileUploadPage extends BasePage {
  protected readonly path = '/upload';

  private readonly fileInput = this.page.locator('#file-upload');
  private readonly submitButton = this.page.locator('#file-submit');
  private readonly uploadedFiles = this.page.locator('#uploaded-files');
  private readonly header = this.page.locator('h3');

  async waitForLoad(): Promise<void> {
    await this.header.waitFor({ state: 'visible' });
  }

  async uploadFile(filePath: string): Promise<void> {
    await this.fileInput.setInputFiles(filePath);
    await this.submitButton.click();
  }

  async getUploadedFileName(): Promise<string> {
    return (await this.uploadedFiles.textContent()) ?? '';
  }
}
