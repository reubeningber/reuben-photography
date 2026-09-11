import { test, expect } from '@playwright/test';

test('homepage loads with highlights', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Reuben Ingber Photography');
  await expect(page.locator('img').first()).toBeVisible();
});

test('an ungrouped top-level album renders', async ({ page }) => {
  await page.goto('/nature/');
  await expect(page).toHaveTitle(/Nature/);
  await expect(page.locator('img').first()).toBeVisible();
});

test('a group landing page renders', async ({ page }) => {
  await page.goto('/family/');
  await expect(page).toHaveTitle(/Family/);
});

test('a nested monthly sub-album renders', async ({ page }) => {
  await page.goto('/family/2026/may/');
  await expect(page.locator('img').first()).toBeVisible();
});

test('a nested sub-album under running renders', async ({ page }) => {
  await page.goto('/running/track-nyc-queens-college/');
  await expect(page.locator('img').first()).toBeVisible();
});

test('a redirect stub for a pre-reorg URL resolves to its new location', async ({ page }) => {
  await page.goto('/little-league/');
  await page.waitForURL(/\/events\/little-league/);
  expect(page.url()).toContain('/events/little-league');
});

test('contact page loads', async ({ page }) => {
  await page.goto('/contact/');
  await expect(page.locator('body')).toBeVisible();
});

test('sitemap-index.xml is valid XML', async ({ request }) => {
  const res = await request.get('/sitemap-index.xml');
  expect(res.ok()).toBeTruthy();
  const xml = await res.text();
  expect(xml).toContain('<?xml');
  expect(xml).toContain('sitemap-0.xml');
});

test('robots.txt points at the sitemap', async ({ request }) => {
  const res = await request.get('/robots.txt');
  expect(res.ok()).toBeTruthy();
  const body = await res.text();
  expect(body).toContain('Sitemap: https://photos.reubeningber.com/sitemap-index.xml');
});
