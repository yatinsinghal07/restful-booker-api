import { test, expect } from '@playwright/test';
import { validCredentials } from '../test-data/authData';
import { validBookingPayload } from '../test-data/bookingData';
import {invalidBookingPayloads} from "../test-data/invalidBookingData";


// ─── Constants ────────────────────────────────────────────────
const BASE_URL = 'https://restful-booker.herokuapp.com';


// ─── Shared state ─────────────────────────────────────────────
let validToken: string;
let existingId: number;

// ─── Suite ────────────────────────────────────────────────────
test.describe.serial('Negative & Error Cases', () => {

  test.beforeAll(async ({ request }) => {
    // Obtain a valid token for use in auth-required negative tests
    const authRes = await request.post(`${BASE_URL}/auth`, {
      data: validCredentials,
    });
    const authBody = await authRes.json();
    validToken = authBody.token;

    // Create one real booking to target in update/delete negative tests
    const bookingRes = await request.post(`${BASE_URL}/booking`, { data: validBookingPayload });
    const bookingBody = await bookingRes.json();
    existingId = bookingBody.bookingid;
  });

  test.afterAll(async ({ request }) => {
    if (!existingId) return;
    // Best-effort cleanup — ignore failures
    await request.delete(`${BASE_URL}/booking/${existingId}`, {
      headers: { Cookie: `token=${validToken}` },
    });
  });

  // ── 404: Non-existent booking ─────────────────────────────────
  test('GET /booking/:id — returns 404 for a non-existent booking', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/booking/99999999`);
    expect(res.status()).toBe(404);
  });

  // ── 401 / 403: PUT without auth token ─────────────────────────
  test('PUT /booking/:id — returns 403 when no auth token is provided', async ({ request }) => {
    const res = await request.put(`${BASE_URL}/booking/${existingId}`, {
      data: validBookingPayload,
      // intentionally omitting auth headers
    });
    expect(res.status()).toBe(403);
  });

  // ── 401 / 403: PATCH without auth token ───────────────────────
  test('PATCH /booking/:id — returns 403 when no auth token is provided', async ({ request }) => {
    const res = await request.patch(`${BASE_URL}/booking/${existingId}`, {
      data: { totalprice: 9999 },
      // intentionally omitting auth headers
    });
    expect(res.status()).toBe(403);
  });

  // ── 401 / 403: DELETE without auth token ──────────────────────
  test('DELETE /booking/:id — returns 403 when no auth token is provided', async ({ request }) => {
    const res = await request.delete(`${BASE_URL}/booking/${existingId}`);
    expect(res.status()).toBe(403);
  });

  // ── 403: Invalid / expired token ─────────────────────────────
  test('PUT /booking/:id — returns 403 for an invalid token', async ({ request }) => {
    const res = await request.put(`${BASE_URL}/booking/${existingId}`, {
      headers: { Cookie: 'token=invalidtoken000' },
      data: validBookingPayload,
    });
    expect(res.status()).toBe(403);
  });

  // ── 404: PUT on non-existent booking ─────────────────────────
  test('PUT /booking/:id — returns 405 for a non-existent booking id', async ({ request }) => {
    const res = await request.put(`${BASE_URL}/booking/99999999`, {
      headers: { Cookie: `token=${validToken}` },
      data: validBookingPayload,
    });
    // restful-booker returns 405 (Method Not Allowed) for non-existent resource on PUT
    expect(res.status()).toBe(405);
  });

  // ── 400: POST /booking with missing required fields ───────────
  test('POST /booking — returns 500 when required fields are missing', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/booking`, {
      data: {
        // Missing firstname, lastname, bookingdates
        totalprice: 100,
        depositpaid: true,
      },
    });
    // restful-booker returns 500 on malformed body
    expect(res.status()).toBe(500);
  });

  // ── 400: POST /booking with empty body ────────────────────────
  test('POST /booking — returns 500 when body is empty', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/booking`, { data: {} });
    expect(res.status()).toBe(500);
  });

  // ── 404: DELETE non-existent booking ─────────────────────────
  test('DELETE /booking/:id — returns 405 for a non-existent booking id', async ({ request }) => {
    const res = await request.delete(`${BASE_URL}/booking/99999999`, {
      headers: { Cookie: `token=${validToken}` },
    });
    // restful-booker returns 405 for non-existent delete targets
    expect(res.status()).toBe(405);
  });
});