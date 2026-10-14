import { test, expect } from '@playwright/test';
import { mockApi, signIn, patientRecords, openInvoice } from './mockApi.js';

test('recording a desk payment posts it to the API and refreshes the invoice list', async ({ page }) => {
  let paid = 0;
  const calls = await mockApi(page, {
    routes: {
      'GET /provider/patient-records': () => [200, patientRecords],
      'GET /provider/invoices': () => [200, { items: [{ ...openInvoice, paidAmountMinor: paid, status: paid ? 'PARTIALLY_PAID' : 'OPEN' }] }],
      'POST /provider/payments': body => { paid += body.amountMinor; return [201, { paymentId: 'pay1' }]; },
    },
  });
  await signIn(page);
  await expect(page.locator('#app-shell')).toBeVisible();
  await page.evaluate(() => { location.hash = 'invoices'; });
  await page.locator('[data-action="open-record-payment"]').first().click();
  await expect(page.locator('#record-payment-form')).toBeVisible();

  // An amount above the balance is refused before any request.
  await page.fill('#record-payment-form [name=amount]', '99999');
  await page.evaluate(() => document.querySelector('#record-payment-form').requestSubmit());
  expect(calls.filter(c => c.key === 'POST /provider/payments')).toHaveLength(0);

  await page.selectOption('#record-payment-form [name=channel]', 'cash');
  await page.fill('#record-payment-form [name=amount]', '2000');
  await page.click('#record-payment-submit');

  await expect.poll(() => calls.filter(c => c.key === 'POST /provider/payments').length).toBe(1);
  const sent = calls.find(c => c.key === 'POST /provider/payments').body;
  expect(sent).toMatchObject({ invoiceId: 'i1', channel: 'cash', amountMinor: 200000, currency: 'NGN' });
  await expect(page.locator('#record-payment-form')).toHaveCount(0);
  await expect.poll(() => calls.filter(c => c.key === 'GET /provider/invoices').length).toBeGreaterThan(1);
});
