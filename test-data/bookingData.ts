export const bookingPayload = {
  firstname: 'John',
  lastname: 'Doe',
  totalprice: 1000,
  depositpaid: true,
  bookingdates: {
    checkin: '2024-01-01',
    checkout: '2024-01-05',
  },
  additionalneeds: 'Breakfast',
};

export const updatedBookingPayload = {
  firstname: 'Eranga',
  lastname: 'Fernando',
  totalprice: 1200,
  depositpaid: true,
  bookingdates: {
    checkin: '2024-01-01',
    checkout: '2024-01-10',
  },
  additionalneeds: 'Lunch',
};

export const partialUpdatePayload = {
  totalprice: 1500,
  additionalneeds: 'Dinner',
};

export const seedBookingPayload = {
  firstname: 'FilterTest',
  lastname: 'User',
  totalprice: 500,
  depositpaid: false,
  bookingdates: {
    checkin: '2025-03-01',
    checkout: '2025-03-10',
  },
  additionalneeds: 'None',
};

export const validBookingPayload = {
  firstname: 'NegTest',
  lastname: 'User',
  totalprice: 100,
  depositpaid: true,
  bookingdates: {
    checkin: '2025-05-01',
    checkout: '2025-05-05',
  },
  additionalneeds: 'None',
};