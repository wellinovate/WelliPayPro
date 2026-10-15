import { test, expect } from '@playwright/test';
import { mockApi, signIn } from './mockApi.js';

test('Subscription shows recorded terms and says when none are recorded', async ({ page }) => {
  await mockApi(page, {
    routes: {
      'GET /provider/subscription': () => [200, { planName: null, monthlyFeeMinor: null, startedAt: null, platformFeePercent: 1, platformFeeSource: 'default' }],
    },
  });
  await signIn(page);
  await page.evaluate(() => { location.hash = 'subscription'; });
  const c = page.locator('#content');
  await expect(c).toContainText('Not recorded');
  await expect(c).toContainText('1%');
  await expect(c).toContainText('standard rate');
});

test('Subscription shows an agreed plan', async ({ page }) => {
  await mockApi(page, {
    routes: {
      'GET /provider/subscription': () => [200, { planName: 'Standard', monthlyFeeMinor: 2500000, startedAt: '2026-11-01T00:00:00.000Z', platformFeePercent: 1.5, platformFeeSource: 'agreed' }],
    },
  });
  await signIn(page);
  await page.evaluate(() => { location.hash = 'subscription'; });
  const c = page.locator('#content');
  await expect(c).toContainText('Standard');
  await expect(c).toContainText('₦25,000');
  await expect(c).toContainText('1.5%');
  await expect(c).not.toContainText('standard rate');
});
