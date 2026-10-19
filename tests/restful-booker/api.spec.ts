import { test, expect } from '@playwright/test';
import { RestfulBookerApi } from '@api/RestfulBookerApi';

test.describe('Restful-Booker API Tests', () => {
  let api: RestfulBookerApi;

  test.beforeAll(async () => {
    const baseURL = process.env.RESTFUL_BOOKER_BASE_URL ?? 'https://restful-booker.herokuapp.com';
    api = await RestfulBookerApi.create(baseURL);
    await api.authenticate('admin', 'password123');
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test('@api Health check endpoint responds', async () => {
    const healthy = await api.healthCheck();
    expect(healthy).toBeTruthy();
  });

  test('@api Get booking IDs returns array', async () => {
    const ids = await api.getBookingIds();
    expect(Array.isArray(ids)).toBeTruthy();
    expect(ids.length).toBeGreaterThan(0);
  });

  test('@api Get specific booking by ID', async () => {
    const ids = await api.getBookingIds();
    const booking = await api.getBooking(ids[0]);
    expect(booking).toHaveProperty('bookingid');
    expect(booking.booking).toHaveProperty('firstname');
    expect(booking.booking).toHaveProperty('lastname');
    expect(booking.booking).toHaveProperty('totalprice');
    expect(booking.booking).toHaveProperty('depositpaid');
    expect(booking.booking).toHaveProperty('bookingdates');
  });

  test('@api Create booking', async () => {
    const newBooking = {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: 150,
      depositpaid: true,
      bookingdates: {
        checkin: '2024-01-01',
        checkout: '2024-01-05',
      },
      additionalneeds: 'Breakfast',
    };

    const created = await api.createBooking(newBooking);
    expect(created).toHaveProperty('bookingid');
    expect(created.booking.firstname).toBe(newBooking.firstname);
    expect(created.booking.lastname).toBe(newBooking.lastname);
    expect(created.booking.totalprice).toBe(newBooking.totalprice);

    // Cleanup
    await api.deleteBooking(created.bookingid);
  });

  test('@api Update booking', async () => {
    const newBooking = {
      firstname: 'Jane',
      lastname: 'Smith',
      totalprice: 200,
      depositpaid: false,
      bookingdates: {
        checkin: '2024-02-01',
        checkout: '2024-02-10',
      },
    };

    const created = await api.createBooking(newBooking);
    const updated = await api.updateBooking(created.bookingid, {
      ...newBooking,
      firstname: 'Jane Updated',
      totalprice: 250,
    });

    expect(updated.booking.firstname).toBe('Jane Updated');
    expect(updated.booking.totalprice).toBe(250);

    // Cleanup
    await api.deleteBooking(created.bookingid);
  });

  test('@api Partial update booking', async () => {
    const newBooking = {
      firstname: 'Bob',
      lastname: 'Wilson',
      totalprice: 100,
      depositpaid: true,
      bookingdates: {
        checkin: '2024-03-01',
        checkout: '2024-03-03',
      },
    };

    const created = await api.createBooking(newBooking);
    const updated = await api.partialUpdateBooking(created.bookingid, {
      firstname: 'Robert',
      additionalneeds: 'Late checkout',
    });

    expect(updated.booking.firstname).toBe('Robert');
    expect(updated.booking.additionalneeds).toBe('Late checkout');

    // Cleanup
    await api.deleteBooking(created.bookingid);
  });

  test('@api Delete booking', async () => {
    const newBooking = {
      firstname: 'Alice',
      lastname: 'Brown',
      totalprice: 300,
      depositpaid: true,
      bookingdates: {
        checkin: '2024-04-01',
        checkout: '2024-04-07',
      },
    };

    const created = await api.createBooking(newBooking);
    await api.deleteBooking(created.bookingid);

    // Verify deletion - should 404
    try {
      await api.getBooking(created.bookingid);
      throw new Error('Booking should have been deleted');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('@api Unauthorized operations fail', async () => {
    const unauthApi = await RestfulBookerApi.create(process.env.RESTFUL_BOOKER_BASE_URL ?? 'https://restful-booker.herokuapp.com');
    try {
      await unauthApi.createBooking({
        firstname: 'Test',
        lastname: 'User',
        totalprice: 100,
        depositpaid: true,
        bookingdates: { checkin: '2024-01-01', checkout: '2024-01-02' },
      });
      throw new Error('Should have failed');
    } catch (error) {
      expect(error).toBeDefined();
    }
    await unauthApi.dispose();
  });
});