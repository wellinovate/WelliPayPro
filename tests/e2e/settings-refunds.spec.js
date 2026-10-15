import { test, expect } from '@playwright/test';
import { mockApi, signIn, patientRecords, openInvoice } from './mockApi.js';

const account = (limitMinor) => ({
  name: 'Test Hospital', providerType: 'HOSPITAL', refundApprovalLimitMinor: limitMinor,
  settlement: { hasPayoutAccount: true, bankCode: '058', accountName: 'TEST HOSPITAL LTD', accountNumberLast4: '4471' },
});

test('Settings shows the real settlement account and saves and removes the refund limit', async ({ page }) => {
  let limit = null;
  const calls = await mockApi(page, {
    routes: {
      'GET /provider/account': () => [200, account(limit)],
      'GET /onboarding/banks': () => [200, { items: [{ code: '058', name: 'Guaranty Trust Bank' }] }],
      'PATCH /provider/account/refund-limit': body => { limit = body.limitMinor; return [200, account(limit)]; },
    },
  });
  await signIn(page);
  await expect(page.locator('#app-shell')).toBeVisible();
  await page.evaluate(() => { location.hash = 'settings'; });
  const content = page.locator('#content');
  await expect(content).toContainText('TEST HOSPITAL LTD');
  await expect(content).toContainText('Guaranty Trust Bank');
  await expect(content).toContainText('••••4471');
  await expect(content).not.toContainText('GTBank ••4471');
  await expect(content).toContainText('No refund limit is set');

  await page.fill('#refund-limit-input', '100000');
  await page.click('#refund-limit-form button[type=submit]');
  await expect.poll(() => calls.filter(c => c.key === 'PATCH /provider/account/refund-limit').length).toBe(1);
  expect(calls.find(c => c.key === 'PATCH /provider/account/refund-limit').body).toEqual({ limitMinor: 10000000 });
  await expect(content).toContainText('Refunds above ₦100,000 need two different approvers.');

  await page.click('[data-action="remove-refund-limit"]');
  await expect.poll(() => calls.filter(c => c.key === 'PATCH /provider/account/refund-limit').length).toBe(2);
  expect(calls.filter(c => c.key === 'PATCH /provider/account/refund-limit')[1].body).toEqual({ limitMinor: null });
  await expect(content).toContainText('No refund limit is set');
});

const refundRoutes = (state) => ({
  'GET /provider/account': () => [200, account(10000000)],
  'GET /provider/patient-records': () => [200, patientRecords],
  'GET /provider/invoices': () => [200, { items: [openInvoice] }],
  'GET /provider/payments': () => [200, { items: [{ paymentId: 'pay1', invoiceId: 'i1', patientRef: 'P-100000', amountMinor: 550000, status: 'SUCCESS' }] }],
  'GET /provider/refunds': () => [200, { items: [{
    refundId: 'rf1', providerRefundRef: 'REF-1', paymentId: 'pay1', invoiceId: 'i1', amountMinor: 25000000, currency: 'NGN',
    reason: 'Cancelled surgery', requestedBy: 'Tunde', status: 'PENDING', createdAt: '2026-10-10T00:00:00Z',
    ...(state.first ? { firstApprovedBy: 'Ada Obi [s1]' } : {}),
  }] }],
  'PATCH /provider/refunds/rf1/decision': () => {
    state.first = true;
    return [200, { refundId: 'rf1', providerRefundRef: 'REF-1', amountMinor: 25000000, status: 'PENDING', firstApprovedBy: 'Ada Obi [s1]', awaitingSecondApproval: true }];
  },
});

test('a refund above the limit records a first approval and waits for a second person', async ({ page }) => {
  const calls = await mockApi(page, { routes: refundRoutes({ first: false }) });
  await signIn(page);
  await expect(page.locator('#app-shell')).toBeVisible();
  await page.evaluate(() => { location.hash = 'refunds'; });
  await expect(page.locator('#content')).toContainText('Refunds above ₦100,000 need two different approvers.');
  await page.locator('[data-action="approve-refund-item"]').first().click();
  await expect.poll(() => calls.filter(c => c.key === 'PATCH /provider/refunds/rf1/decision').length).toBe(1);
  await expect(page.locator('#content')).toContainText('First approval: Ada Obi');
  await expect(page.locator('[data-action="approve-refund-item"]').first()).toHaveText('Give second approval');
  await expect(page.locator('#content')).toContainText('Pending');
});

test('a billing user sees refunds but no approve or reject buttons', async ({ page }) => {
  await mockApi(page, { level: 'BILLING', routes: refundRoutes({ first: false }) });
  await signIn(page);
  await expect(page.locator('#app-shell')).toBeVisible();
  await page.evaluate(() => { location.hash = 'refunds'; });
  await expect(page.locator('#content')).toContainText('Cancelled surgery');
  await expect(page.locator('[data-action="approve-refund-item"]')).toHaveCount(0);
  await expect(page.locator('[data-action="reject-refund-item"]')).toHaveCount(0);
});

test('a user cannot approve a refund they requested but can reject it', async ({ page }) => {
  const routes = refundRoutes({ first: false });
  const original = routes['GET /provider/refunds'];
  routes['GET /provider/refunds'] = () => {
    const [status, body] = original();
    body.items[0].requestedBy = 'Ada Obi [s1]';
    return [status, body];
  };
  await mockApi(page, { routes });
  await signIn(page);
  await expect(page.locator('#app-shell')).toBeVisible();
  await page.evaluate(() => { location.hash = 'refunds'; });
  await expect(page.locator('#content')).toContainText('You requested this refund. Someone else must approve it.');
  await expect(page.locator('[data-action="approve-refund-item"]')).toHaveCount(0);
  await expect(page.locator('[data-action="reject-refund-item"]')).toHaveCount(1);
});
