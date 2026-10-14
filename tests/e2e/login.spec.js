import { test, expect } from '@playwright/test';
import { mockApi, signIn } from './mockApi.js';

test('a wrong password shows the API message and stays on the sign-in screen', async ({ page }) => {
  await mockApi(page, {
    routes: { 'POST /staff/login': () => [401, { title: 'Unauthorized', detail: 'Email or password is not correct.' }] },
  });
  await signIn(page, 'a@b.co', 'wrong');
  await expect(page.locator('#auth-error')).toHaveText('Email or password is not correct.');
  await expect(page.locator('#app-shell')).toBeHidden();
});

test('a correct login opens the console and a reload keeps the session', async ({ page }) => {
  await mockApi(page);
  await signIn(page);
  await expect(page.locator('#app-shell')).toBeVisible();
  await expect(page.locator('#topbar-role')).toContainText('Admin');
  await page.reload();
  await expect(page.locator('#app-shell')).toBeVisible();
  await expect(page.locator('#login-email')).toHaveCount(0);
});

test('a cashier does not see admin pages and is redirected from them', async ({ page }) => {
  await mockApi(page, { level: 'CASHIER' });
  await signIn(page);
  await expect(page.locator('#app-shell')).toBeVisible();
  const nav = page.locator('#navigation');
  await expect(nav).toContainText('Hospital Desk');
  await expect(nav).not.toContainText('Settlements');
  await expect(nav).not.toContainText('API & Developers');
  await page.evaluate(() => { location.hash = 'staff'; });
  await expect(page.locator('#page-title')).toHaveText('Hospital Desk');
});

test('an offline request shows the banner and a reachable one clears it', async ({ page, context }) => {
  await mockApi(page);
  await signIn(page);
  await expect(page.locator('#app-shell')).toBeVisible();
  await expect(page.locator('#offline-banner')).toBeHidden();
  await context.setOffline(true);
  await expect(page.locator('#offline-banner')).toBeVisible();
  await context.setOffline(false);
  await expect(page.locator('#offline-banner')).toBeHidden();
});
