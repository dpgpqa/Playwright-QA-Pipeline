import { request } from '@playwright/test';

interface CheckOptions {
  url: string;
  timeout?: number;
  interval?: number;
  expectedStatus?: number;
}

export async function waitForEnvironment(options: CheckOptions): Promise<boolean> {
  const { url, timeout = 120000, interval = 5000, expectedStatus = 200 } = options;
  const startTime = Date.now();
  const client = await request.newContext();

  console.info(`Waiting for environment at ${url}...`);

  while (Date.now() - startTime < timeout) {
    try {
      const response = await client.get(url);
      if (response.status() === expectedStatus) {
        console.info(`Environment ready at ${url}`);
        await client.dispose();
        return true;
      }
    } catch {
      // Ignore errors, keep retrying
    }

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.info(`Environment not ready yet (${elapsed}s elapsed), retrying in ${interval / 1000}s...`);
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  await client.dispose();
  console.error(`Environment at ${url} did not become ready within ${timeout / 1000}s`);
  return false;
}

export async function checkAllEnvironments(): Promise<Record<string, boolean>> {
  const urls = {
    saucedemo: process.env.SAUCEDEMO_BASE_URL ?? 'https://www.saucedemo.com',
    restfulBooker: process.env.RESTFUL_BOOKER_BASE_URL ?? 'https://restful-booker.herokuapp.com',
    theInternet: process.env.THE_INTERNET_BASE_URL ?? 'https://the-internet.herokuapp.com',
    jsonPlaceholder: process.env.JSONPLACEHOLDER_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
    demoQA: process.env.DEMOQA_BASE_URL ?? 'https://demoqa.com',
  };

  const results: Record<string, boolean> = {};

  for (const [name, url] of Object.entries(urls)) {
    results[name] = await waitForEnvironment({ url, timeout: 30000, interval: 3000 });
  }

  return results;
}
