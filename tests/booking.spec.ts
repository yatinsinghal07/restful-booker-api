import { test, expect } from '@playwright/test';
import {seedBookingPayload} from '../test-data/bookingData';
import {validCredentials} from '../test-data/authData';
// ─── Constants ────────────────────────────────────────────────
const BASE_URL = 'https://restful-booker.herokuapp.com';

// Seed booking used as a known anchor for filter assertions

// ─── Shared state ─────────────────────────────────────────────
let seededId: number;

// ─── Suite ────────────────────────────────────────────────────
test.describe.serial('Get Bookings — Listing & Filters', () => {

  // Create a known booking before filter tests
  test.beforeAll(async ({ request }) => {
    const res = await request.post(`/booking`, { data: seedBookingPayload });
    const body = await res.json();
    expect(res.status()).toBe(200);
    seededId = body.bookingid;
  });

  // Clean up the seeded booking after all tests
  test.afterAll(async ({ request }) => {
    if (!seededId) return;

    const authRes = await request.post(`/auth`, {
      data: validCredentials,
    });
    const { token } = await authRes.json();

    await request.delete(`/booking/${seededId}`, {
      headers: { Cookie: `token=${token}` },
    });
  });

  // ── 1. List all bookings ──────────────────────────────────────
  test('GET /booking — returns a list of booking IDs', async ({ request }) => {
    const res = await request.get(`/booking`);
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);

    // Each item must have a numeric bookingid
    for (const item of body) {
      expect(item).toHaveProperty('bookingid');
      expect(typeof item.bookingid).toBe('number');
    }
  });

  // ── 2. Seeded ID appears in the list ─────────────────────────
  test('GET /booking — seeded booking ID appears in the list', async ({ request }) => {
    const res = await request.get(`/booking`);
    const body: { bookingid: number }[] = await res.json();

    const ids = body.map((b) => b.bookingid);
    expect(ids).toContain(seededId);
  });

  // ── 3. Filter by firstname ────────────────────────────────────
  test('GET /booking?firstname= — filters by firstname', async ({ request }) => {
    const res = await request.get(`/booking?firstname=${seedBookingPayload.firstname}`);
    const body: { bookingid: number }[] = await res.json();

    expect(res.status()).toBe(200);
    expect(Array.isArray(body)).toBe(true);

    const ids = body.map((b) => b.bookingid);
    expect(ids).toContain(seededId);
  });

  // ── 4. Filter by lastname ─────────────────────────────────────
  test('GET /booking?lastname= — filters by lastname', async ({ request }) => {
    const res = await request.get(`/booking?lastname=${seedBookingPayload.lastname}`);
    const body: { bookingid: number }[] = await res.json();

    expect(res.status()).toBe(200);
    const ids = body.map((b) => b.bookingid);
    expect(ids).toContain(seededId);
  });

  // ── 5. Filter by checkin date ─────────────────────────────────
  test('GET /booking?checkin= — filters by checkin date', async ({ request }) => {
    const res = await request.get(
      `/booking?checkin=${seedBookingPayload.bookingdates.checkin}`,
    );
    const body: { bookingid: number }[] = await res.json();

    expect(res.status()).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  // ── 6. Filter by checkout date ────────────────────────────────
  test('GET /booking?checkout= — filters by checkout date', async ({ request }) => {
    const res = await request.get(
      `/booking?checkout=${seedBookingPayload.bookingdates.checkout}`,
    );
    const body: { bookingid: number }[] = await res.json();

    expect(res.status()).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  // ── 7. Filter by firstname + lastname (combined) ──────────────
  test('GET /booking?firstname=&lastname= — combined filter returns correct booking', async ({ request }) => {
    const res = await request.get(
      `/booking?firstname=${seedBookingPayload.firstname}&lastname=${seedBookingPayload.lastname}`,
    );
    const body: { bookingid: number }[] = await res.json();

    expect(res.status()).toBe(200);
    const ids = body.map((b) => b.bookingid);
    expect(ids).toContain(seededId);
  });

  // ── 8. Non-existent name returns empty array ──────────────────
  test('GET /booking?firstname= — non-existent name returns empty list', async ({ request }) => {
    const res = await request.get(`/booking?firstname=ZZZNoSuchPerson999`);
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(0);
  });
});