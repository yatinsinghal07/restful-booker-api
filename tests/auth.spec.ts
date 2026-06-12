import { test, expect } from '@playwright/test';
import {validCredentials,invalidPasswordCredentials,invalidUsernameCredentials,emptyCredentials} from '../test-data/authData';
import {validatejsonHeader, ValidateStatus} from '../utils/responseValidator';


// ─── Constants ────────────────────────────────────────────────
const BASE_URL = 'https://restful-booker.herokuapp.com';

// ─── Suite ────────────────────────────────────────────────────
test.describe('Auth API — Edge Cases', () => {

  // ── 1. Valid credentials ─────────────────────────────────────
  test('POST /auth — returns a token with valid credentials', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth`, {
      data: validCredentials,
    });
    const body = await res.json();

    ValidateStatus(res, 200);
    validatejsonHeader(res);
    expect(body.token).toBeDefined();
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  // ── 2. Wrong password ────────────────────────────────────────
  test('POST /auth — returns "Bad credentials" for wrong password', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth`, {
      data: invalidPasswordCredentials,
    });
    const body = await res.json();

    // API always returns 200 but with a "reason" field on failure
    ValidateStatus(res, 200);
    validatejsonHeader(res);
    expect(body.reason).toBe('Bad credentials');
    expect(body.token).toBeUndefined();
  });

  // ── 3. Wrong username ────────────────────────────────────────
  test('POST /auth — returns "Bad credentials" for wrong username', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth`, {
      data: invalidUsernameCredentials,
    });
    const body = await res.json();

    ValidateStatus(res, 200);
    validatejsonHeader(res);
    expect(body.reason).toBe('Bad credentials');
    expect(body.token).toBeUndefined();
  });

  // ── 4. Empty credentials ─────────────────────────────────────
  test('POST /auth — returns "Bad credentials" for empty username and password', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth`, {
      data: emptyCredentials,
    });
    const body = await res.json();

    ValidateStatus(res, 200);
    validatejsonHeader(res);
    expect(body.reason).toBe('Bad credentials');
    expect(body.token).toBeUndefined();
  });

  // ── 5. Missing fields ─────────────────────────────────────────
  test('POST /auth — returns "Bad credentials" when fields are missing', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth`, {
      data: {},
    });
    const body = await res.json();

    ValidateStatus(res, 200);
    validatejsonHeader(res);
    expect(body.reason).toBe('Bad credentials');
    expect(body.token).toBeUndefined();
  });

  // ── 6. Token uniqueness ──────────────────────────────────────
  test('POST /auth — two valid auth calls return different tokens', async ({ request }) => {
    const [res1, res2] = await Promise.all([
      request.post(`${BASE_URL}/auth`, { data: validCredentials }),
      request.post(`${BASE_URL}/auth`, { data: validCredentials }),
    ]);

    const [body1, body2] = await Promise.all([res1.json(), res2.json()]);

    expect(body1.token).toBeTruthy();
    expect(body2.token).toBeTruthy();
    // Tokens should be distinct per session
    ValidateStatus(res1, 200);
    validatejsonHeader(res1);
    ValidateStatus(res2, 200);
    validatejsonHeader(res2);
    expect(body1.token).not.toBe(body2.token);
  });

  // ── 7. Response time ─────────────────────────────────────────
  test('POST /auth — responds within 3 seconds', async ({ request }) => {
    const start = Date.now();

    const res = await request.post(`${BASE_URL}/auth`, {
      data: validCredentials,
    });

    const elapsed = Date.now() - start;

    ValidateStatus(res, 200);
    validatejsonHeader(res);
    expect(elapsed, `Auth took ${elapsed}ms — exceeds 3s threshold`).toBeLessThan(3000);
  });
});