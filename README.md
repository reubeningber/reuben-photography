# Reuben Photography

Photography portfolio site for Reuben Ingber, built with Astro and deployed to `photos.reubeningber.com`.

## Overview

This repo contains the standalone photography site that was split out from the main `reubeningber.com` site. It is a static Astro project with:

- a fixed desktop sidebar and mobile drawer navigation
- expandable nav groups (e.g. a 2026 group with per-month sub-albums)
- a custom inline SVG logo system
- per-album photo data files loaded at build time
- Cloudinary-hosted image delivery
- GitHub Pages deployment with a custom subdomain

## Stack

- Astro 6
- Static output
- Cloudinary image URLs generated at render time
- GitHub Actions + GitHub Pages

## Local Development

Requirements:

- Node `>=22.12.0`

Commands:

```sh
npm install
npm run dev
npm run build
npm run preview
```

Local dev runs on Astro's default port, usually `http://localhost:4321`.

No environment variables are needed to build or run the site. `.env` (Cloudinary API credentials) is only needed to run `scripts/upload-to-cloudinary.mjs` — see Uploading Photos below.

## Project Structure

```text
.
├── public/
│   ├── CNAME
│   └── favicon*
├── scripts/
│   └── upload-to-cloudinary.mjs
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Logo.astro
│   │   ├── LogoHorizontalDark.astro
│   │   ├── LogoHorizontalLight.astro
│   │   ├── LogoStackedDark.astro
│   │   ├── LogoStackedLight.astro
│   │   ├── MasonryGrid.astro          # grid + hand-rolled lightbox
│   │   ├── Sidebar.astro
│   │   └── CloudflareAnalytics.astro
│   ├── data/
│   │   ├── albums.ts                  # nav tree + top-level album list
│   │   ├── config.ts                  # Cloudinary cloud name, contact email, hero photo
│   │   └── photos/                    # one JSON file per album, filename == slug
│   │       ├── highlights.json
│   │       ├── family.json
│   │       ├── nature.json
│   │       ├── running.json
│   │       ├── urban.json
│   │       ├── paris.json / lancaster.json
│   │       ├── manhattanhenge.json / little-league.json
│   │       ├── track-nyc-queens-college.json
│   │       └── 2026-<month>.json      # one per month under Family
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro                # shows highlights.json
│   │   ├── contact.astro
│   │   ├── [album].astro              # top-level, ungrouped albums (urban, nature)
│   │   ├── family/
│   │   │   ├── index.astro
│   │   │   └── 2026/[month].astro
│   │   ├── running/
│   │   │   ├── index.astro
│   │   │   └── [album].astro          # sub-albums, e.g. track-nyc-queens-college
│   │   ├── travel/[album].astro       # paris, lancaster
│   │   └── events/[album].astro       # manhattanhenge, little-league
│   └── utils/
│       └── cloudinary.ts
└── .github/workflows/deploy.yml
```

## Content Model

### Navigation

Album navigation lives in `src/data/albums.ts`. It exports two things:

- `navItems` — the full navigation tree, used by `Sidebar.astro`. Top-level items can be either a plain `Album` (with a `slug` and `label`) or a `NavGroup` (with a `slug`, `label`, `children` array of `Album`s, and an optional `hasOwnPage` flag for groups like Family/Running that have their own landing page in addition to their children).
- `albums` — a flat list of only the *ungrouped* top-level albums (currently `urban` and `nature`), used by `src/pages/[album].astro` to generate routes. Grouped albums (Travel, Family, Running, Events) each have their own route file under `src/pages/` instead — see Routes below.

To add a new top-level album, add an entry to `navItems`. To add a new grouped sub-album (e.g. a new month under 2026), add it to the relevant `NavGroup`'s `children` array.

### Photos

Each album has its own JSON file in `src/data/photos/`. The filename must match the album's `slug`. Each photo entry includes:

- `publicId` — Cloudinary public ID
- `album` — album slug (matches the filename)
- `alt` — alt text
- `width` / `height` — original image dimensions

### Routes

- `/` — shows `highlights.json`
- `/<album>` — an ungrouped top-level album, e.g. `/urban`, `/nature` (via `src/pages/[album].astro`)
- `/family`, `/running` — landing pages for groups with `hasOwnPage: true`
- `/family/2026/<month>` — a monthly sub-album, e.g. `/family/2026/may`
- `/running/<album>`, `/travel/<album>`, `/events/<album>` — sub-albums nested under their group
- `/contact` — contact page

Old URLs from before the nav was reorganized into groups (`/manhattanhenge`, `/little-league`, `/2026/<month>`) still resolve — `astro.config.mjs`'s `redirects` config generates static redirect stubs from each old path to its new location.

## Adding a New Monthly Album (2026)

1. Add the month to the `family` group's `children` array in `src/data/albums.ts` (slug format: `2026/<month>`)
2. Create `src/data/photos/2026-<month>.json` with the photo entries for that month
3. Run `npm run build`, then commit and push

## Cloudinary

Cloudinary settings are in `src/data/config.ts`:

- `CLOUD_NAME`
- `CONTACT_EMAIL`
- `HERO_PHOTO_ID`

Image URLs are assembled in `src/utils/cloudinary.ts`. If you move to a different Cloudinary account, update `CLOUD_NAME` there.

### Uploading photos

`scripts/upload-to-cloudinary.mjs` uploads a folder of images to `portfolio/<album-name>/` in Cloudinary:

```sh
cp .env.example .env
# fill in CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET (from the Cloudinary dashboard)
node scripts/upload-to-cloudinary.mjs ~/Desktop/Portfolio/little-league little-league
```

This only uploads the images — it doesn't touch `src/data/photos/` or `src/data/albums.ts`. After uploading, add the returned public IDs to the relevant album's JSON file (and to `navItems` if it's a new album) by hand.

## Branding and Layout

The logo is drawn directly in `src/components/Logo.astro`, with separate wrappers for stacked and horizontal variants.

Navigation, expandable groups, and mobile drawer behavior live in `src/components/Sidebar.astro`.

Global page framing, favicons, and tab title live in `src/layouts/Layout.astro`.

## Deployment

This repo is configured for GitHub Pages in `.github/workflows/deploy.yml`.

Deployment assumptions:

- Astro `site` is set to `https://photos.reubeningber.com` in `astro.config.mjs`
- `public/CNAME` contains `photos.reubeningber.com`
- GitHub Pages is configured to deploy from GitHub Actions
- Cloudflare DNS should point:

```txt
Type: CNAME
Name: photos
Target: reubeningber.github.io
```

This record is currently **proxied** (orange-cloud) through Cloudflare — traffic goes browser → Cloudflare → GitHub Pages, not straight to GitHub Pages the way the apex `reubeningber.com` domain does. (If HTTPS certificate issuance is ever failing on a fresh setup, temporarily switching the record to `DNS only` and back can help — GitHub's cert issuance sometimes needs to see the origin directly first.)

## Analytics

[Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) is wired up via a hardcoded beacon token in `src/components/CloudflareAnalytics.astro`, included in `Layout.astro`'s `<head>`. It uses the manual JS-snippet method rather than Cloudflare's "automatic injection" option — automatic injection only applies to hostnames registered as their own Cloudflare "website" (zone), and this subdomain is part of the `reubeningber.com` zone rather than a zone of its own, so the manual snippet is required even though the record is proxied.

## Testing

An end-to-end smoke test suite (Playwright) covers the homepage, an ungrouped album, a group landing page, a nested monthly sub-album, a nested sub-album under Running, an old pre-reorg URL's redirect, the contact page, the sitemap, and `robots.txt`.

```sh
npm run test:e2e
```

Before running for the first time, install the Playwright browser:

```sh
npx playwright install --with-deps chromium
```

Tests live in `tests/e2e/` and run automatically on push/PR via `.github/workflows/test.yml`.

## Updating The Site

Typical content update flow:

1. Add or edit nav items in `src/data/albums.ts`
2. Add or edit photo entries in the relevant `src/data/photos/<album>.json`
3. Run `npm run build`
4. Commit and push to `main`

GitHub Actions will build and publish the site automatically.
