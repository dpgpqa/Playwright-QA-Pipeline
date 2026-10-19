import { FullConfig } from '@playwright/test';
import { rmSync } from 'fs';
import { join } from 'path';

async function globalTeardown(config: FullConfig) {
  // Clean up auth storage after CI runs
  if (process.env.CI) {
    const authDir = join(process.cwd(), '.auth');
    try {
      rmSync(authDir, { recursive: true, force: true });
    } catch {
      // Directory doesn't exist, that's fine
    }
  }

  console.log('Global teardown completed');
}

export default globalTeardown;
