// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://photos.reubeningber.com',
  output: 'static',
  integrations: [sitemap()],
  redirects: {
    '/manhattanhenge': '/events/manhattanhenge',
    '/little-league': '/events/little-league',
    '/family/2026/[month]': '/2026/[month]',
  },
});
