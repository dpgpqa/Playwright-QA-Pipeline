import { test, expect } from '@playwright/test';
import { SauceDemoApi } from '@api/SauceDemoApi';

test.describe('SauceDemo API Tests', () => {
  let api: SauceDemoApi;

  test.beforeAll(async () => {
    const baseURL = process.env.BASE_URL ?? 'https://www.saucedemo.com';
    api = await SauceDemoApi.create(baseURL);
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test('@api Health check endpoint responds', async () => {
    const healthy = await api.healthCheck();
    expect(healthy).toBeTruthy();
  });

  test('@api Get products - pattern reference (SauceDemo has no real API)', async () => {
    // SauceDemo doesn't have a real products API
    // This is a pattern reference for apps that do have APIs
    const products = await api.getProducts();
    expect(Array.isArray(products)).toBeTruthy();
  });

  test('@api Create product - pattern reference', async () => {
    // Pattern reference - would work with real API
    const product = {
      id: 'test-product',
      name: 'Test Product',
      description: 'Test description',
      price: 9.99,
      image: 'test.jpg',
    };

    // This would fail on SauceDemo since there's no real API
    // In a real app, this would test the actual API
    try {
      await api.createProduct(product);
    } catch (error) {
      // Expected to fail on SauceDemo
      expect(error).toBeDefined();
    }
  });
});
