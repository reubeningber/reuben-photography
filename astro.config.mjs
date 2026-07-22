// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://photos.reubeningber.com',
  output: 'static',
  redirects: {
    '/manhattanhenge': '/events/manhattanhenge',
    '/little-league': '/events/little-league',
    '/2026/[month]': '/family/2026/[month]',
  },
});
