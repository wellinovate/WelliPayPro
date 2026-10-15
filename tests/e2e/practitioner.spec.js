import { test, expect } from '@playwright/test';
import { mockApi, signIn } from './mockApi.js';

test('an independent practitioner sees practice wording and no hospital-only pages', async ({ page }) => {
  await mockApi(page, { providerType: 'INDEPENDENT_PRACTITIONER' });
  await signIn(page);
  await expect(page.locator('#app-shell')).toBeVisible();
  const nav = page.locator('nav, .sidebar').first();
  await expect(page.locator('.tenant')).toContainText('Independent practitioner');
  await expect(page.locator('body')).toContainText('Practice Desk');
  // Lab, pharmacy and corporate pages are not offered to a practitioner.
  for (const name of ['Check-up packages', 'Corporate accounts', 'Dispensing']) {
    await expect(nav).not.toContainText(name);
  }
  await page.evaluate(() => { location.hash = 'services-pricing'; });
  await expect(page.locator('#content')).toContainText('Services & Pricing');
  await expect(page.locator('#content')).not.toContainText(/hospital/i);
  await page.evaluate(() => { location.hash = 'hospital-desk'; });
  await expect(page.locator('#content')).not.toContainText('Hospital Desk');
});
