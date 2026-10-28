import { test, expect } from '@playwright/test';

test('homepage loads with highlights', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Reuben Ingber Photography');
  await expect(page.locator('img').first()).toBeVisible();
});

test('an ungrouped top-level album renders', async ({ page }) => {
  await page.goto('/street/');
  await expect(page).toHaveTitle(/Street/);
  await expect(page.locator('img').first()).toBeVisible();
});

test('every group has a landing page with album cards', async ({ page }) => {
  for (const group of ['family', 'events', 'running', 'nature', 'travel', '2026']) {
    await page.goto(`/${group}/`);
    await expect(page.locator('.album-card').first()).toBeVisible();
  }
});

test('the Family page lists each year with its season albums', async ({ page }) => {
  await page.goto('/family/');
  await expect(page.locator('.album-section h2', { hasText: '2026' })).toBeVisible();
  await expect(page.locator('.album-card', { hasText: 'Spring' })).toHaveAttribute('href', '/family/2026/spring/');
});

test('a nested group (a family year) lists its seasons', async ({ page }) => {
  await page.goto('/family/2026/');
  await expect(page).toHaveTitle(/2026 · Family/);
  await expect(page.locator('.album-card', { hasText: 'Fall' })).toBeVisible();
});

test('a family season album renders with a breadcrumb', async ({ page }) => {
  await page.goto('/family/2026/fall/');
  await expect(page).toHaveTitle(/Fall · 2026 · Family/);
  await expect(page.locator('.breadcrumb a', { hasText: 'Family' })).toHaveAttribute('href', '/family/');
  await expect(page.locator('.masonry img').first()).toBeVisible();
});

test('a monthly 2026 album renders', async ({ page }) => {
  await page.goto('/2026/may/');
  await expect(page.locator('img').first()).toBeVisible();
});

test('a nested sub-album under running renders', async ({ page }) => {
  await page.goto('/running/track-nyc-queens-college/');
  await expect(page.locator('img').first()).toBeVisible();
});

test('a nested sub-album under nature renders', async ({ page }) => {
  await page.goto('/nature/kaaterskill-falls/');
  await expect(page).toHaveTitle(/Kaaterskill Falls/);
  await expect(page.locator('img').first()).toBeVisible();
});

test('a redirect stub for a pre-reorg URL resolves to its new location', async ({ page }) => {
  await page.goto('/little-league/');
  await page.waitForURL(/\/family\/2026\/spring\//);
  expect(page.url()).toContain('/family/2026/spring/');
});

test('the old /urban/ URL redirects to /street/', async ({ page }) => {
  await page.goto('/urban/');
  await page.waitForURL(/\/street\//);
  expect(page.url()).toContain('/street/');
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
