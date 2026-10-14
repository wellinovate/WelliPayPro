import { test, expect } from '@playwright/test';
import { mockApi, signIn, patientRecords, openInvoice } from './mockApi.js';

test('matching an unmatched transaction to an invoice posts the match and clears the row', async ({ page }) => {
  let matched = false;
  const calls = await mockApi(page, {
    routes: {
      'GET /provider/patient-records': () => [200, patientRecords],
      'GET /provider/invoices': () => [200, { items: [openInvoice] }],
      'GET /provider/unmatched-transactions': () => [200, {
        items: [{ transactionId: 't1', source: 'BANK_TRANSFER', amountMinor: 550000, reference: 'TRF-889', receivedAt: '2026-10-12T09:00:00Z', status: matched ? 'MATCHED' : 'UNMATCHED' }],
      }],
      'POST /provider/unmatched-transactions/t1/match': () => {
        matched = true;
        return [200, { source: 'BANK_TRANSFER', amountMinor: 550000, invoice: { paidAmountMinor: 550000, status: 'PAID' } }];
      },
    },
  });
  await signIn(page);
  await expect(page.locator('#app-shell')).toBeVisible();
  await page.evaluate(() => { location.hash = 'reconciliation'; });
  await expect(page.locator('#content')).toContainText('Ref: TRF-889');
  await page.locator('[data-action="open-match"]').first().click();
  await expect(page.locator('#match-transaction-form')).toBeVisible();
  await page.selectOption('#match-transaction-form [name=invoiceId]', 'i1');
  await page.evaluate(() => document.querySelector('#match-transaction-form').requestSubmit());
  await expect.poll(() => calls.filter(c => c.key === 'POST /provider/unmatched-transactions/t1/match').length).toBe(1);
  expect(calls.find(c => c.key === 'POST /provider/unmatched-transactions/t1/match').body).toEqual({ invoiceId: 'i1' });
  await expect(page.locator('#content')).not.toContainText('Ref: TRF-889');
});
