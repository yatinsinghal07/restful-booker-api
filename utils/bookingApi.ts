import { APIRequestContext } from "@playwright/test";

export async function createBooking(request: APIRequestContext, payload: object) {
    return await request.post(`/booking`, {
        data: payload,
    });
}

export async function getBooking(request: APIRequestContext, id: number) {
    return await request.get(`/booking/${id}`);
}

export async function updateBooking(request: APIRequestContext, id: number, payload: object, token: string) {
    return await request.put(`/booking/${id}`, {
        headers: { Cookie: `token=${token}` },
        data: payload,
    });
}

export async function partialUpdateBooking(request: APIRequestContext, id: number, payload: object, token: string) {
    return await request.patch(`/booking/${id}`, {
        headers: { Cookie: `token=${token}` },
        data: payload,
    });
}

export async function deleteBooking(request: APIRequestContext, id: number, token: string) {
    return await request.delete(`/booking/${id}`, {
        headers: { Cookie: `token=${token}` },
    });
}