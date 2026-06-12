import {APIRequestContext, expect} from "@playwright/test";
import { validCredentials } from "../test-data/authData";

// ─── Constants ────────────────────────────────────────────────
 

export async function getAuthToken(request: APIRequestContext): Promise<string> {
    const res = await request.post(`/auth`, {
        data: validCredentials,
    });
    const body = await res.json();
    expect(res.status()).toBe(200);
    expect(body.token, 'Auth token should be generated').toBeTruthy();
    return body.token;
}