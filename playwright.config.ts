import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:4322',
  },
  webServer: {
    // Always test the production build: @astrojs/sitemap only emits
    // sitemap-index.xml at build time, so the dev server 404s it. The build takes
    // about a second. Port 4322 keeps a running `npm run dev` (4321) from being
    // picked up by mistake.
    command: 'npm run build && npm run preview -- --port 4322',
    url: 'http://localhost:4322',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
