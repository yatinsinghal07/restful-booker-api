import { APIRequestContext, APIResponse } from "@playwright/test";
import { BookingPayload } from "../types/bookingTypes";

export async function createBooking(request: APIRequestContext, payload: BookingPayload): Promise<APIResponse> {
    return await request.post(`/booking`, {
        data: payload,
    });
}

export async function getBooking(request: APIRequestContext, id: number): Promise<APIResponse> {
    return await request.get(`/booking/${id}`);
}

export async function updateBooking(request: APIRequestContext, id: number, payload: BookingPayload, token: string): Promise<APIResponse> {
    return await request.put(`/booking/${id}`, {
        headers: { Cookie: `token=${token}` },
        data: payload,
    });
}

export async function partialUpdateBooking(request: APIRequestContext, id: number, payload: Partial<BookingPayload>, token: string): Promise<APIResponse> {
    return await request.patch(`/booking/${id}`, {
        headers: { Cookie: `token=${token}` },
        data: payload,
    });
}

export async function deleteBooking(request: APIRequestContext, id: number, token: string): Promise<APIResponse> {
    return await request.delete(`/booking/${id}`, {
        headers: { Cookie: `token=${token}` },
    });
}