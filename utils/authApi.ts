import { APIRequestContext, APIResponse } from '@playwright/test';
import {AuthCredentials} from '../types/authTypes';

export async function createToken(request: APIRequestContext, payload: AuthCredentials): Promise<APIResponse> {
  return await request.post('/auth', {
    data: payload,
  });
}