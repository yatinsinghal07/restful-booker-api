import { defineConfig } from '@playwright/test';

declare const process: { env: { CI?: string } };

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  timeout: 30_000,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: 'https://restful-booker.herokuapp.com',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
  // Each spec file is exposed as a separate project in the Playwright report.
  projects: [
    {
      name: 'Suite 1 - CRUD Booking',
      testMatch: 'Booking.crud.spec.ts',
    },
    {
      name: 'Suite 2 - Auth Edge Cases',
      testMatch: 'auth.spec.ts',
    },
    {
      name: 'Suite 3 - Get Bookings & Filters',
      testMatch: 'booking.spec.ts',
    },
    {
      name: 'Suite 4 - Negative & Error Cases',
      testMatch: 'negative.spec.ts',
    },
  ],
});
