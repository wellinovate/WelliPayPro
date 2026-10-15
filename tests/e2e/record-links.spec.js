import { test, expect } from '@playwright/test';
import { mockApi, signIn } from './mockApi.js';

const link = (over = {}) => ({
  id: 'c1', kind: 'PROVIDER_PATIENT_NUMBER', reference: 'LAB 12/445', status: 'PENDING_VERIFICATION', nextStep: 'AWAIT_PROVIDER_REVIEW',
  createdAt: '2026-10-16T09:00:00Z', grantsRecordAccess: false, patientRef: 'P-100200', patientName: 'Amina Yusuf', patientPhone: '08031234567', ...over,
});

test('Billing reviews a patient number and approves it', async ({ page }) => {
  let items = [link(), link({ id: 'c2', kind: 'WELLIRECORD', reference: 'WR-2291-04', status: 'VERIFIED', integrationName: 'WelliRecord', verifiedAt: '2026-10-15T09:00:00Z', nextStep: 'NONE' })];
  const calls = await mockApi(page, {
    level: 'BILLING',
    routes: {
      'GET /provider/record-connections': () => [200, { items }],
      'PATCH /provider/record-connections/c1/decision': body => { items = [link({ status: 'VERIFIED', nextStep: 'NONE' }), items[1]]; return [200, { ...items[0], decisionNote: body.note }]; },
    },
  });
  await signIn(page);
  await expect(page.locator('#app-shell')).toBeVisible();
  await page.evaluate(() => { location.hash = 'record-links'; });
  const c = page.locator('#content');
  await expect(c).toContainText('Amina Yusuf');
  await expect(c).toContainText('LAB 12/445');
  await expect(c).toContainText('does not give anyone access to records');
  await c.getByRole('button', { name: 'Approve' }).click();
  await expect(page.locator('#modal-root')).toContainText('08031234567');
  await page.locator('#modal-root button[type=submit]').click();
  await expect.poll(() => calls.some(x => x.key === 'PATCH /provider/record-connections/c1/decision' && x.body.decision === 'APPROVE')).toBe(true);
  await expect(c.getByRole('button', { name: 'Approve' })).toHaveCount(0);
});

test('A rejection needs a note', async ({ page }) => {
  const calls = await mockApi(page, { routes: { 'GET /provider/record-connections': () => [200, { items: [link()] }] } });
  await signIn(page);
  await expect(page.locator('#app-shell')).toBeVisible();
  await page.evaluate(() => { location.hash = 'record-links'; });
  await page.locator('#content').getByRole('button', { name: 'Reject' }).click();
  await page.locator('#modal-root button[type=submit]').click();
  expect(calls.some(x => x.key.startsWith('PATCH'))).toBe(false);
});

test('A cashier sees the list but no decision buttons', async ({ page }) => {
  await mockApi(page, { level: 'CASHIER', routes: { 'GET /provider/record-connections': () => [200, { items: [link()] }] } });
  await signIn(page);
  await expect(page.locator('#app-shell')).toBeVisible();
  await page.evaluate(() => { location.hash = 'record-links'; });
  await expect(page.locator('#content')).toContainText('LAB 12/445');
  await expect(page.locator('#content').getByRole('button', { name: 'Approve' })).toHaveCount(0);
});
