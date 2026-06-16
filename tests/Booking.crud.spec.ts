import { test, expect } from '@playwright/test';
import {bookingPayload, updatedBookingPayload, partialUpdatePayload} from '../test-data/bookingData';
import { validCredentials } from '../test-data/authData';
import { getAuthToken } from '../utils/authHelper';
import {validatejsonHeader, ValidateStatus, validateBookingData} from '../utils/responseValidator';
import { createBooking, getBooking, updateBooking, partialUpdateBooking, deleteBooking } from '../utils/bookingApi';

// ─── Constants ────────────────────────────────────────────────
const BASE_URL = 'https://restful-booker.herokuapp.com';


// ─── Shared state ─────────────────────────────────────────────
let token: string;
let bookingId: number;

// ─── Helpers ──────────────────────────────────────────────────
function authHeaders() {
  return { Cookie: `token=${token}` };
}

// ─── Suite ────────────────────────────────────────────────────
test.describe.serial('Booking API', () => {
  // Runs once before all tests — avoids repeating auth in every test
  test.beforeAll(async ({ request }) => {
   token = await getAuthToken(request);
  });

  // ── 1. Create ───────────────────────────────────────────────
  test('@smoke POST /booking — creates a booking and returns correct data', async ({ request }) => {
    const res = await createBooking(request, bookingPayload);
    const body = await res.json();

    expect(res.status()).toBe(200);

    // Assert shape
    expect(body.bookingid).toBeDefined();
    expect(typeof body.bookingid).toBe('number');

    // Assert the server echoes back what we sent
    validateBookingData(body.booking, bookingPayload);
    bookingId = body.bookingid;
    expect(bookingId, 'Create step did not return a booking id').toBeDefined();
  });

  // ── 2. Read ─────────────────────────────────────────────────
  test('GET /booking/:id — retrieves the created booking', async ({ request }) => {
    expect(bookingId, 'Booking id is missing. Ensure create test runs first').toBeDefined();

    const res = await getBooking(request, bookingId);
    const body = await res.json();

    ValidateStatus(res, 200);
    validatejsonHeader(res);
    validateBookingData(body, bookingPayload);
  });

  // ── 3. Full update (PUT) ─────────────────────────────────────
  test('@SMOKE PUT /booking/:id — fully replaces booking data', async ({ request }) => {
    expect(bookingId, 'Booking id is missing. Ensure create test runs first').toBeDefined();
    const res = await updateBooking(request, bookingId, updatedBookingPayload, token);
    const body = await res.json();

    ValidateStatus(res, 200);
    validatejsonHeader(res);
    validateBookingData(body, updatedBookingPayload);
  });

  // ── 4. Partial update (PATCH) ────────────────────────────────
  test('PATCH /booking/:id — partially updates booking data', async ({ request }) => {
    expect(bookingId, 'Booking id is missing. Ensure create test runs first').toBeDefined();
    const res = await partialUpdateBooking(request, bookingId, partialUpdatePayload, token);
    const body = await res.json();

    ValidateStatus(res, 200);
    validatejsonHeader(res);
    expect(body.totalprice).toBe(partialUpdatePayload.totalprice);
    expect(body.additionalneeds).toBe('Dinner');
    // Fields not in the patch should be unchanged
    expect(body.firstname).toBe(updatedBookingPayload.firstname);
  });

  // ── 5. Delete ────────────────────────────────────────────────
  test('@SMOKE DELETE /booking/:id — removes the booking', async ({ request }) => {
    expect(bookingId, 'Booking id is missing. Ensure create test runs first').toBeDefined();
    const deleteRes = await deleteBooking(request, bookingId, token);

    // ⚠️ restful-booker returns 201 (not 200) on successful delete
    ValidateStatus(deleteRes, 201);
   

    // Confirm it's actually gone
    const verifyRes = await request.get(`/booking/${bookingId}`);
    ValidateStatus(verifyRes, 404);
  });
});