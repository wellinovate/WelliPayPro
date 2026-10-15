import { test, expect } from '@playwright/test';
import { mockApi, signIn, patientRecords } from './mockApi.js';

// With an empty account the live console must not show sample people, figures or events.
const INVENTED = ['₦3.4M', '96.4%', 'Reliance HMO', 'WR-2291-04', 'Tunde Adeleke', 'Dr. Chidi Obi', 'Femi Okafor', '1,248', '3,204', '4,204', 'Adaeze', 'abchealth.ng', 'Demo event', 'Sandbox'];
const PAGES = ['payments', 'wellipass', 'reconciliation', 'payment-plans', 'staff', 'audit-log', 'mobile-app', 'dashboard', 'support', 'subscription'];

test('an empty live account shows no sample figures, people or events', async ({ page }) => {
  await mockApi(page, {
    routes: {
      'GET /provider/payments/settlement': () => [200, { summary: { awaitingMinor: 0, processingMinor: 0, settledMinor: 0, failedMinor: 0, feesMinor: 0 }, hasPayoutAccount: false, items: [] }],
      'GET /provider/wallet-summary': () => [200, { patientsWithCredit: 0, totalCreditMinor: 0 }],
    },
  });
  await signIn(page);
  await expect(page.locator('#app-shell')).toBeVisible();
  for (const p of PAGES) {
    await page.evaluate(h => { location.hash = h; }, p);
    await page.waitForTimeout(500);
    const text = await page.locator('#content').innerText();
    for (const bad of INVENTED) expect(text, `${p} shows "${bad}"`).not.toContain(bad);
  }
});

test('Payments tiles are computed from the live journal', async ({ page }) => {
  const now = new Date().toISOString();
  await mockApi(page, {
    routes: {
      'GET /provider/patient-records': () => [200, patientRecords],
      'GET /provider/payments': () => [200, { items: [
        { paymentId: 'pay000001', invoiceId: 'i1', patientRef: 'P-100000', providerPaymentRef: 'CASH-1', channel: 'cash', amountMinor: 250000, status: 'SUCCESS', occurredAt: now, facilityRef: 'f' },
        { paymentId: 'pay000002', invoiceId: 'i1', patientRef: 'P-100000', providerPaymentRef: 'CARD-1', channel: 'card', amountMinor: 100000, status: 'SUCCESS', occurredAt: now, facilityRef: 'f' },
        { paymentId: 'pay000003', invoiceId: 'i2', patientRef: 'P-100000', providerPaymentRef: 'CARD-2', channel: 'card', amountMinor: 900000, status: 'FAILED', occurredAt: now, facilityRef: 'f' },
      ] }],
    },
  });
  await signIn(page);
  await expect(page.locator('#app-shell')).toBeVisible();
  await page.evaluate(() => { location.hash = 'payments'; });
  const c = page.locator('#content');
  await expect(c).toContainText('₦3,500');
  await expect(c).not.toContainText('₦12,500');
  await expect(c.locator('table tbody tr')).toHaveCount(3);
});

test('the audit log shows the saved trail from the API, not sample names', async ({ page }) => {
  const calls = await mockApi(page, {
    routes: {
      'GET /provider/audit-events': (_b, req) => {
        const q = new URL(req.url()).searchParams;
        const all = [
          { id: 'a2', at: '2026-10-16T09:30:00Z', actorType: 'STAFF', actorName: 'Ada Obi', action: 'Decided a refund', method: 'PATCH', route: '/provider/refunds/:refundId/decision', resourceId: 'rf_1', statusCode: 200 },
          { id: 'a1', at: '2026-10-16T09:00:00Z', actorType: 'STAFF', actorName: 'Ada Obi', action: 'Signed in', method: 'POST', route: '/staff/login', statusCode: 200 },
        ];
        const items = q.get('q') ? all.filter(e => e.action.toLowerCase().includes(q.get('q').toLowerCase())) : all;
        return [200, { items }];
      },
    },
  });
  await signIn(page);
  await expect(page.locator('#app-shell')).toBeVisible();
  await page.evaluate(() => { location.hash = 'audit-log'; });
  const c = page.locator('#content');
  await expect(c).toContainText('Decided a refund');
  await expect(c).toContainText('Ada Obi');
  await expect(c).toContainText('Signed in');
  await expect(c).not.toContainText('Adaeze');
  await expect(c).not.toContainText('212');
  await page.fill('#audit-filter-form [name=q]', 'refund');
  await page.evaluate(() => document.querySelector('#audit-filter-form').requestSubmit());
  await expect(c).not.toContainText('Signed in');
  await expect(c).toContainText('Decided a refund');
  expect(calls.some(x => x.key === 'GET /provider/audit-events')).toBe(true);
});
