import { test, expect } from '@playwright/test';
import {validCredentials,invalidPasswordCredentials,invalidUsernameCredentials,emptyCredentials,} from '../test-data/authData';
import { validatejsonHeader, ValidateStatus } from '../utils/responseValidator';
import { createToken } from '../utils/authApi';

test.describe('Auth API — Edge Cases', () => {
  test('POST /auth — returns a token with valid credentials', async ({ request }) => {
    const res = await createToken(request, validCredentials);
    const body = await res.json();

    ValidateStatus(res, 200);
    validatejsonHeader(res);
    expect(body.token).toBeDefined();
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('POST /auth — returns "Bad credentials" for wrong password', async ({ request }) => {
    const res = await createToken(request, invalidPasswordCredentials);
    const body = await res.json();

    ValidateStatus(res, 200);
    validatejsonHeader(res);
    expect(body.reason).toBe('Bad credentials');
    expect(body.token).toBeUndefined();
  });

  test('POST /auth — returns "Bad credentials" for wrong username', async ({ request }) => {
    const res = await createToken(request, invalidUsernameCredentials);
    const body = await res.json();

    ValidateStatus(res, 200);
    validatejsonHeader(res);
    expect(body.reason).toBe('Bad credentials');
    expect(body.token).toBeUndefined();
  });

  test('POST /auth — returns "Bad credentials" for empty username and password', async ({ request }) => {
    const res = await createToken(request, emptyCredentials);
    const body = await res.json();

    ValidateStatus(res, 200);
    validatejsonHeader(res);
    expect(body.reason).toBe('Bad credentials');
    expect(body.token).toBeUndefined();
  });

  test('POST /auth — returns "Bad credentials" when fields are missing', async ({ request }) => {
    const res = await createToken(request, {});
    const body = await res.json();

    ValidateStatus(res, 200);
    validatejsonHeader(res);
    expect(body.reason).toBe('Bad credentials');
    expect(body.token).toBeUndefined();
  });

  test('POST /auth — two valid auth calls return valid tokens', async ({ request }) => {
    const [res1, res2] = await Promise.all([
      createToken(request, validCredentials),
      createToken(request, validCredentials),
    ]);

    const [body1, body2] = await Promise.all([res1.json(), res2.json()]);

    ValidateStatus(res1, 200);
    validatejsonHeader(res1);
    ValidateStatus(res2, 200);
    validatejsonHeader(res2);

    expect(body1.token).toBeTruthy();
    expect(body2.token).toBeTruthy();
  });

  test('POST /auth — responds within 3 seconds', async ({ request }) => {
    const start = Date.now();

    const res = await createToken(request, validCredentials);

    const elapsed = Date.now() - start;

    ValidateStatus(res, 200);
    validatejsonHeader(res);
    expect(elapsed, `Auth took ${elapsed}ms — exceeds 3s threshold`).toBeLessThan(3000);
  });
});