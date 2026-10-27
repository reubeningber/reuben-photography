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
    // Pre-grouping URLs
    '/manhattanhenge': '/events/manhattanhenge/',
    '/little-league': '/family/2026/spring/',
    '/family/2026/january': '/2026/january/',
    '/family/2026/february': '/2026/february/',
    '/family/2026/march': '/2026/march/',
    '/family/2026/april': '/2026/april/',
    '/family/2026/may': '/2026/may/',
    '/family/2026/june': '/2026/june/',
    // October 2026 reorganization
    '/urban': '/street/',
    '/events/little-league': '/family/2026/spring/',
    '/family/first-day-of-school-2026': '/family/2026/first-day-of-school/',
  },
});
