import {APIResponse,expect} from "@playwright/test";

export function ValidateStatus(response: APIResponse, expectedStatus: number) {
    expect(response.status()).toBe(expectedStatus);
}

export function validatejsonHeader(response: APIResponse){
    const header = response.headers();
    expect(header['content-type']).toContain('application/json');
}

export function validateBookingData(actualBooking: any, expectedBooking: any) {
  expect(actualBooking.firstname).toBe(expectedBooking.firstname);
  expect(actualBooking.lastname).toBe(expectedBooking.lastname);
  expect(actualBooking.totalprice).toBe(expectedBooking.totalprice);
  expect(actualBooking.depositpaid).toBe(expectedBooking.depositpaid);
  expect(actualBooking.bookingdates.checkin).toBe(expectedBooking.bookingdates.checkin);
  expect(actualBooking.bookingdates.checkout).toBe(expectedBooking.bookingdates.checkout);
  expect(actualBooking.additionalneeds).toBe(expectedBooking.additionalneeds);
}