import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const BASE_URLS = {
  saucedemo: process.env.SAUCEDEMO_BASE_URL ?? 'https://www.saucedemo.com',
  restfulBooker: process.env.RESTFUL_BOOKER_BASE_URL ?? 'https://restful-booker.herokuapp.com',
  theInternet: process.env.THE_INTERNET_BASE_URL ?? 'https://the-internet.herokuapp.com',
  jsonPlaceholder: process.env.JSONPLACEHOLDER_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
  demoQA: process.env.DEMOQA_BASE_URL ?? 'https://demoqa.com',
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['json', { outputFile: 'reports/json/results.json' }],
    ['blob', { outputDir: 'blob-report' }],
  ],
  use: {
    baseURL: BASE_URLS.saucedemo,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: undefined,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
    },
  },
  outputDir: 'test-results',
  globalSetup: require.resolve('./src/fixtures/global.setup.ts'),
  globalTeardown: require.resolve('./src/fixtures/global.teardown.ts'),
  metadata: {
    'test-environment': process.env.NODE_ENV ?? 'local',
    'base-urls': JSON.stringify(BASE_URLS),
  },
});
