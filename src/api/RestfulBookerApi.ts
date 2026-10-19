import type { APIRequestContext} from '@playwright/test';
import { request } from '@playwright/test';
import { z } from 'zod';

const AuthSchema = z.object({
  token: z.string(),
});

const BookingSchema = z.object({
  bookingid: z.number(),
  booking: z.object({
    firstname: z.string(),
    lastname: z.string(),
    totalprice: z.number(),
    depositpaid: z.boolean(),
    bookingdates: z.object({
      checkin: z.string(),
      checkout: z.string(),
    }),
    additionalneeds: z.string().optional(),
  }),
});

const BookingIdsSchema = z.array(z.object({ bookingid: z.number() }));

export class RestfulBookerApi {
  private client: APIRequestContext;
  private token: string | null = null;

  private constructor(client: APIRequestContext) {
    this.client = client;
  }

  static async create(baseURL: string): Promise<RestfulBookerApi> {
    const client = await request.newContext({ baseURL });
    return new RestfulBookerApi(client);
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

  async getBookingIds(): Promise<number[]> {
    const response = await this.client.get('/booking');
    const data = await response.json();
    const parsed = BookingIdsSchema.parse(data);
    return parsed.map((b) => b.bookingid);
  }

  async getBooking(id: number) {
    const response = await this.client.get(`/booking/${id}`);
    const data = await response.json();
    return BookingSchema.parse(data);
  }

  async createBooking(booking: {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: { checkin: string; checkout: string };
    additionalneeds?: string;
  }) {
    const response = await this.client.post('/booking', {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: booking,
    });
    const data = await response.json();
    return BookingSchema.parse(data);
  }

  async updateBooking(id: number, booking: {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: { checkin: string; checkout: string };
    additionalneeds?: string;
  }) {
    if (!this.token) throw new Error('Not authenticated');
    const response = await this.client.put(`/booking/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${this.token}`,
      },
      data: booking,
    });
    const data = await response.json();
    return BookingSchema.parse(data);
  }

  async partialUpdateBooking(id: number, partial: Partial<{
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: { checkin: string; checkout: string };
    additionalneeds?: string;
  }>) {
    if (!this.token) throw new Error('Not authenticated');
    const response = await this.client.patch(`/booking/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${this.token}`,
      },
      data: partial,
    });
    const data = await response.json();
    return BookingSchema.parse(data);
  }

  async deleteBooking(id: number): Promise<void> {
    if (!this.token) throw new Error('Not authenticated');
    await this.client.delete(`/booking/${id}`, {
      headers: { Cookie: `token=${this.token}` },
    });
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/ping');
      return response.ok();
    } catch {
      return false;
    }
  }

  async dispose(): Promise<void> {
    await this.client.dispose();
  }
}
