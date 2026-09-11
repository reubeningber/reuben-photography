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
npm run dev      # local dev server
npm run build    # production build to /dist
npm run preview  # preview the build
```

## Project Structure

```
src/
  data/
    albums.ts            # nav tree (navItems) + top-level ungrouped album list (albums)
    config.ts             # CLOUD_NAME, CONTACT_EMAIL, HERO_PHOTO_ID
    photos/                # one JSON file per album/sub-album, filename == slug (dashes for slashes, e.g. 2026-may.json)
  layouts/
    Layout.astro           # root HTML shell — head, Sidebar, global styles
  components/
    Header.astro
    Logo.astro, LogoHorizontalDark/Light.astro, LogoStackedDark/Light.astro
    Sidebar.astro          # nav + mobile drawer, reads navItems from albums.ts
    MasonryGrid.astro      # photo grid + hand-rolled lightbox (no PhotoSwipe/library)
    CloudflareAnalytics.astro
  pages/
    index.astro                    # highlights.json
    contact.astro
    [album].astro                  # ungrouped top-level albums only (urban, nature)
    family/index.astro             # Family landing page
    family/[album].astro           # Family sub-albums (e.g. first-day-of-school-2026)
    2026/[month].astro             # monthly 2026 sub-albums
    running/index.astro            # Running landing page
    running/[album].astro          # sub-albums (e.g. track-nyc-queens-college)
    travel/[album].astro           # paris, lancaster
    events/[album].astro           # manhattanhenge, little-league
  utils/
    cloudinary.ts           # URL/srcset builders
scripts/
  upload-to-cloudinary.mjs  # standalone Node script, uploads a local folder to Cloudinary
```

## Content Model

Two files drive everything:

- **`src/data/albums.ts`** — `navItems` is the nav tree (`Album` = `{slug, label}`, `NavGroup` = `{slug, label, children, hasOwnPage?}`). `albums` is the filtered subset of `navItems` that are plain `Album`s (not groups) — only these get routed by `src/pages/[album].astro`. Grouped albums (Travel, Family, Running, Events) each have a dedicated route file instead.
- **`src/data/photos/<slug>.json`** — one file per album/sub-album. Filename must match the album's `slug`, with `/` replaced by `-` for nested slugs. The `2026` group's month routes read `src/data/photos/2026-<month>.json` explicitly (e.g. `2026` child `may` → `src/data/photos/2026-may.json`). Each entry: `publicId`, `album`, `alt`, `width`, `height`.

There is no CMS and no content-collections schema (unlike the main `reubeningber.com` repo) — adding an album means hand-editing `albums.ts` and adding a JSON file.

## Adding Content

**New photos in an existing album**: append entries to the album's JSON file in `src/data/photos/`.

**New top-level ungrouped album**: add to `navItems` in `albums.ts` (it'll automatically be picked up by `albums` and routed via `[album].astro`) and create the matching `src/data/photos/<slug>.json`.

**New sub-album under an existing group** (e.g. a new month under Family): add to that group's `children` array in `albums.ts`, then create `src/data/photos/<slug-with-dashes>.json`. The group's route file (`2026/[month].astro`, `family/[album].astro`, `running/[album].astro`, etc.) picks it up via `getStaticPaths`.

**New top-level group**: needs a new route file under `src/pages/<group-slug>/` following the pattern of `travel/[album].astro` or `events/[album].astro`, in addition to the `albums.ts` entry.

**Uploading the actual images**: `node scripts/upload-to-cloudinary.mjs <folder> <album-name>` pushes files to `portfolio/<album-name>/` in Cloudinary. It does not touch `albums.ts` or the photos JSON — those still need manual edits with the resulting public IDs.

## Redirects

`astro.config.mjs` has a `redirects` map for URLs that predate the current grouped nav structure (`/manhattanhenge` → `/events/manhattanhenge`, `/little-league` → `/events/little-league`, `/family/2026/[month]` → `/2026/[month]`). If a slug moves to a new nested location again, add the old path here rather than letting it 404.

## Deployment

- `.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`, via `actions/deploy-pages` (no build-time secrets needed — Cloudinary cloud name is a public, non-secret value in `config.ts`)
- `public/CNAME` pins the custom domain (`photos.reubeningber.com`)
- DNS is on Cloudflare and **proxied** (unlike the main `reubeningber.com` apex domain, which is DNS-only) — see the README's Deployment section for what that implies for HTTPS issuance and analytics

## Testing

`tests/e2e/smoke.spec.ts` (Playwright) covers routing across the different page shapes: an ungrouped album, a group landing page, a nested monthly sub-album, a nested sub-album under a different group, an old pre-reorg URL's redirect, the sitemap, and `robots.txt`. No unit tests — unlike the main `reubeningber.com` repo, there's no pure logic here worth isolating (no content-collection filtering, no date math).

```bash
npx playwright install --with-deps chromium  # first time only
npm run test:e2e
```

Runs on push/PR via `.github/workflows/test.yml`. Unlike the main repo's `deploy.yml`, this repo's `deploy.yml` is not currently gated on tests passing — see the main repo's `docs/deployment.md` for the `workflow_run` pattern if that's wanted here too.

## Relationship to the main site

This repo used to be part of `reubeningber.com` (photo galleries, `PhotoGrid.astro`, PhotoSwipe lightbox, an `albums` content collection). It was split out into its own site/repo so photography could have its own design and tooling without dragging photo-specific dependencies into what's otherwise a simple blog. The main site's `Header.astro`/`Footer.astro` link here as an external link; there's no shared layout, design system, or code between the two repos.
