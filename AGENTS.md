# reuben-photography — AI Agent Guide

Standalone photography portfolio for Reuben Ingber, split out from the main `reubeningber.com` site. Built with Astro 6, deployed to GitHub Pages at `photos.reubeningber.com` via GitHub Actions (DNS on Cloudflare, proxied).

## Tech Stack

- **Framework**: Astro 6 (`output: 'static'`, no SSR)
- **Styling**: hand-written CSS in `Layout.astro` (`<style is:global>`) — no Tailwind, no CSS framework
- **Images**: Cloudinary, cloud name in `src/data/config.ts`
- **Analytics**: Cloudflare Web Analytics (beacon token hardcoded in `CloudflareAnalytics.astro`)
- **SEO**: `@astrojs/sitemap` generates `sitemap-index.xml`; `public/robots.txt` links to it
- **Site URL**: `https://photos.reubeningber.com`

## Key Commands

```bash
nvm use          # Node version pinned in .nvmrc (also used by CI)
npm run dev      # local dev server
npm run build    # production build to /dist
npm run preview  # preview the build
```

## Project Structure

```
src/
  data/
    albums.ts             # nav tree (navItems): groups can nest, e.g. Family > 2026 > Fall
    library.ts            # walks the nav tree; loads photos, covers, date ranges, highlights
    config.ts             # CLOUD_NAME, CONTACT_EMAIL, HERO_PHOTO_ID
    photos/               # one JSON file per album/group, named by its URL path with dashes (family-2026-fall.json)
  layouts/
    Layout.astro          # root HTML shell — head, Sidebar, global styles
  components/
    Header.astro          # unused
    Logo.astro, LogoHorizontalDark/Light.astro, LogoStackedDark/Light.astro
    Sidebar.astro         # nav + mobile drawer, renders navTree (up to 3 levels)
    AlbumCards.astro      # cover card per child album on group landing pages
    MasonryGrid.astro     # photo grid + hand-rolled lightbox (no PhotoSwipe/library)
    CloudflareAnalytics.astro
  pages/
    index.astro           # highlights: every photo flagged "highlight": true, newest first
    contact.astro
    [...path].astro       # every group landing page and album, generated from navItems
  utils/
    cloudinary.ts           # URL/srcset builders
scripts/
  upload-to-cloudinary.mjs  # standalone Node script, uploads a local folder to Cloudinary
```

## Content Model

Two files drive everything:

- **`src/data/albums.ts`** — `navItems` is the nav tree. `Album` = `{slug, label}`; `NavGroup` = `{slug, label, children}` where children can themselves be groups (Family > 2026 > Fall). A node's URL is its slugs joined: `/family/2026/fall/`. `src/pages/[...path].astro` generates a page for every node — no per-group route files.
- **`src/data/photos/<path-with-dashes>.json`** — the photos for the node at that path: `family/2026/fall` → `family-2026-fall.json`, `street` → `street.json`. A group may have its own file too (`nature.json`, `running.json`); those photos show below the group's album cards. Each entry: `publicId`, `album`, `alt`, `width`, `height`, optional `highlight`.

Pages:

- **Group** (has children): breadcrumb, a cover card per child (cover = first highlighted photo, else first photo; with date range and count), then the group's own photos if it has a JSON file.
- **Album** (leaf): breadcrumb, then the masonry grid.
- **Homepage**: every photo with `"highlight": true` in any album JSON, newest first by filename date, de-duplicated by filename. There is no separate highlights file — tag the photo in its album.

Family is split by year, then season (winter = Jan, Feb, and Dec of the same calendar year; spring = Mar–May; summer = Jun–Aug; fall = Sep–Nov), using the `YYYYMMDD` date at the start of each filename. A year with too few photos for seasons (2025) is a single album, `family/2025`. Children are listed newest first.

There is no CMS and no content-collections schema (unlike the main `reubeningber.com` repo) — adding an album means hand-editing `albums.ts` and adding a JSON file.

## Adding Content

**New photos in an existing album**: add entries at the top of the album's JSON file in `src/data/photos/`. Check for duplicates by filename across every JSON first.

**Feature a photo on the homepage**: add `"highlight": true` to its entry in its album's JSON.

**New album anywhere** (top level, in a group, or in a nested group): add it to `navItems` in `albums.ts` and create `src/data/photos/<full-path-with-dashes>.json`. **New group**: same, with `children`; it gets a landing page automatically.

**Uploading the actual images**: `node scripts/upload-to-cloudinary.mjs <folder> <album-name>` pushes files to `portfolio/<album-name>/` in Cloudinary. It does not touch `albums.ts` or the photos JSON — those still need manual edits with the resulting public IDs. Cloudinary folders don't have to match the URL path (Family seasons still point at `portfolio/family/...`).

## Redirects

`astro.config.mjs` has a `redirects` map for old URLs: the pre-grouping ones (`/manhattanhenge`, `/little-league`, `/family/2026/<month>`) and the October 2026 reorganization (`/urban` → `/street/`, `/events/little-league` → `/family/2026/spring/`, `/family/first-day-of-school-2026` → `/family/2026/first-day-of-school/`). If a page moves, add the old path here rather than letting it 404.

## Deployment

- `.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`, via `actions/deploy-pages` (no build-time secrets needed — Cloudinary cloud name is a public, non-secret value in `config.ts`)
- `public/CNAME` pins the custom domain (`photos.reubeningber.com`)
- DNS is on Cloudflare and **proxied** (unlike the main `reubeningber.com` apex domain, which is DNS-only) — see the README's Deployment section for what that implies for HTTPS issuance and analytics

## Testing

`tests/e2e/smoke.spec.ts` (Playwright) covers routing across the different page shapes: an ungrouped album, every group landing page, a nested family year and season, a monthly album, sub-albums under Running and Nature, old-URL redirects, the sitemap, and `robots.txt`. No unit tests — unlike the main `reubeningber.com` repo, there's no pure logic here worth isolating (no content-collection filtering, no date math).

```bash
npx playwright install --with-deps chromium  # first time only
npm run test:e2e
```

Runs on push/PR via `.github/workflows/test.yml`. Unlike the main repo's `deploy.yml`, this repo's `deploy.yml` is not currently gated on tests passing — see the main repo's `docs/deployment.md` for the `workflow_run` pattern if that's wanted here too.

## Relationship to the main site

This repo used to be part of `reubeningber.com` (photo galleries, `PhotoGrid.astro`, PhotoSwipe lightbox, an `albums` content collection). It was split out into its own site/repo so photography could have its own design and tooling without dragging photo-specific dependencies into what's otherwise a simple blog. The main site's `Header.astro`/`Footer.astro` link here as an external link; there's no shared layout, design system, or code between the two repos.
