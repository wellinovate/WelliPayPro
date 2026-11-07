import { test, expect } from '@playwright/test';
import { mockApi, signIn } from './mockApi.js';

const inReview = {
  preAuthId: 'pa1', patientRef: 'P-1', hmoPolicyId: 'h1', facilityRef: 'Test Hospital', procedure: 'Knee scan',
  estimatedCost: { amountMinor: 15000000, currency: 'NGN' },
  coveredAmount: { amountMinor: 0, currency: 'NGN' },
  patientPortion: { amountMinor: 0, currency: 'NGN' },
  status: 'IN_REVIEW', notes: 'Sent for review.', requestedAt: '2026-11-07T10:00:00.000Z',
};

test('staff record the HMO covered amount and code when approving a pre-authorization', async ({ page }) => {
  const calls = await mockApi(page, {
    routes: {
      'GET /provider/pre-authorizations': () => [200, { items: [inReview] }],
      'PATCH /provider/pre-authorizations/pa1': () => [200, { ...inReview, status: 'APPROVED', coveredAmount: { amountMinor: 12000000, currency: 'NGN' }, patientPortion: { amountMinor: 3000000, currency: 'NGN' }, approvalCode: 'HMO-778' }],
    },
  });
  await signIn(page);
  await expect(page.locator('#app-shell')).toBeVisible();
  await page.evaluate(() => { location.hash = 'authorization'; });
  const c = page.locator('#content');
  await expect(c).toContainText('Knee scan');
  await expect(c).toContainText('In review');
  await c.getByRole('button', { name: 'Update' }).click();
  const form = page.locator('#preauth-status-form');
  await form.locator('select[name=status]').selectOption('APPROVED');
  await form.locator('input[name=covered]').fill('120000');
  await form.locator('input[name=approvalCode]').fill('HMO-778');
  await form.getByRole('button', { name: 'Save' }).click();
  await expect.poll(() => calls.find(x => x.key === 'PATCH /provider/pre-authorizations/pa1')?.body).toEqual({
    status: 'APPROVED', approvalCode: 'HMO-778', coveredAmountMinor: 12000000, notes: 'Sent for review.',
  });
});
