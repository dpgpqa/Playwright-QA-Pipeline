import type { APIRequestContext } from '@playwright/test';
import { request } from '@playwright/test';
import { z } from 'zod';

const AuthSchema = z.object({
  token: z.string(),
});

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string(),
});

export class SauceDemoApi {
  private client: APIRequestContext;
  private token: string | null = null;

  private constructor(client: APIRequestContext) {
    this.client = client;
  }

  static async create(baseURL: string): Promise<SauceDemoApi> {
    const client = await request.newContext({ baseURL });
    return new SauceDemoApi(client);
  }

  async authenticate(username: string, password: string): Promise<string> {
    const response = await this.client.post('/auth', {
      data: { username, password },
    });
    const data = await response.json();
    const parsed = AuthSchema.parse(data);
    this.token = parsed.token;
    return this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  async getProducts(): Promise<z.infer<typeof ProductSchema>[]> {
    // SauceDemo doesn't have a real products API, this is a pattern reference
    // In a real app, this would hit /api/products
    const response = await this.client.get('/inventory.html');
    const _html = await response.text();
    // Parse from HTML or use a real API endpoint
    return [];
  }

  async createProduct(product: z.infer<typeof ProductSchema>) {
    const response = await this.client.post('/api/products', {
      headers: { 'Content-Type': 'application/json' },
      data: product,
    });
    const data = await response.json();
    return ProductSchema.parse(data);
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/');
      return response.ok();
    } catch {
      return false;
    }
  }

  async dispose(): Promise<void> {
    await this.client.dispose();
  }
}