import { FullConfig } from '@playwright/test';
import { mkdirSync, rmSync } from 'fs';
import { join } from 'path';

async function globalSetup(config: FullConfig) {
  // Validate required environment variables
  const requiredEnvVars = ['SAUCEDEMO_BASE_URL'];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar] && !process.env[envVar.replace('BASE_URL', 'BASE_URL')]) {
      console.warn(`Warning: ${envVar} not set, using default`);
    }
  }

  // Clean up previous auth storage
  const authDir = join(process.cwd(), '.auth');
  try {
    rmSync(authDir, { recursive: true, force: true });
  } catch {
    // Directory doesn't exist, that's fine
  }
  mkdirSync(authDir, { recursive: true });

  // Clean up previous reports
  const reportDirs = ['reports', 'test-results', 'blob-report'];
  for (const dir of reportDirs) {
    try {
      rmSync(join(process.cwd(), dir), { recursive: true, force: true });
    } catch {
      // Directory doesn't exist, that's fine
    }
    mkdirSync(join(process.cwd(), dir), { recursive: true });
  }

  console.log('Global setup completed');
}

export default globalSetup;
