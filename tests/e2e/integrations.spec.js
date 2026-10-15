import { test, expect } from '@playwright/test';
import { mockApi, signIn } from './mockApi.js';

test('Integrations shows what the API reports and nothing invented', async ({ page }) => {
  await mockApi(page, {
    routes: {
      'GET /provider/integrations/status': () => [200, {
        paystack: { configured: true, hasPayoutAccount: false },
        sms: { configured: false, senderId: 'N-Alert' },
        webhooks: { activeEndpoints: 2, pendingEvents: 3, deadLetteredEvents: 1, lastDeliveredAt: '2026-10-14T09:30:00Z' },
      }],
    },
  });
  await signIn(page);
  await expect(page.locator('#app-shell')).toBeVisible();
  await page.evaluate(() => { location.hash = 'integrations'; });
  const c = page.locator('#content');
  await expect(c).toContainText('No payout account is set up.');
  await expect(c).toContainText('2 active endpoints');
  await expect(c).toContainText('3 events waiting');
  await expect(c).toContainText('1 given up');
  await expect(c).toContainText('Not set up');
  await expect(c).not.toContainText('4,204');
});

test('Support and Subscription state what the console does not hold', async ({ page }) => {
  await mockApi(page, { routes: { 'GET /provider/subscription': () => [200, { planName: null, monthlyFeeMinor: null, startedAt: null, platformFeePercent: 1, platformFeeSource: 'default' }] } });
  await signIn(page);
  await expect(page.locator('#app-shell')).toBeVisible();
  await page.evaluate(() => { location.hash = 'support'; });
  await expect(page.locator('#content')).toContainText('does not track support tickets');
  await expect(page.locator('#content')).not.toContainText('4.8 / 5');
  await page.evaluate(() => { location.hash = 'subscription'; });
  await expect(page.locator('#content')).toContainText('Not recorded');
  await expect(page.locator('#content')).not.toContainText('85,000');
});
