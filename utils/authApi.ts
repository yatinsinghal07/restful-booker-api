import { APIRequestContext } from '@playwright/test';

export async function createToken(request: APIRequestContext, payload: object) {
  return await request.post('/auth', {
    data: payload,
  });
}