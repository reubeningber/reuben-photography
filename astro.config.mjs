// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://photos.reubeningber.com',
  output: 'static',
  // GitHub Pages serves every page at its trailing-slash URL and 301s the
  // slash-less form; keep internal links and redirect targets matching that.
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
  redirects: {
    '/manhattanhenge': '/events/manhattanhenge/',
    '/little-league': '/events/little-league/',
    '/family/2026/[month]': '/2026/[month]',
  },
});
