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
- `@astrojs/sitemap` — generates `sitemap-index.xml` at build time; linked from `public/robots.txt`
- Cloudinary image URLs generated at render time
- GitHub Actions + GitHub Pages

## Local Development

Requirements:

- Node `>=22.12.0` (pinned to the latest 26.x in `.nvmrc`)

Commands:

```sh
nvm install   # first time only; reads .nvmrc
nvm use
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
│   │   ├── AlbumCards.astro           # cover cards on group landing pages
│   │   ├── Header.astro               # unused
│   │   ├── Logo.astro
│   │   ├── LogoHorizontalDark.astro
│   │   ├── LogoHorizontalLight.astro
│   │   ├── LogoStackedDark.astro
│   │   ├── LogoStackedLight.astro
│   │   ├── MasonryGrid.astro          # grid + hand-rolled lightbox
│   │   ├── Sidebar.astro
│   │   └── CloudflareAnalytics.astro
│   ├── data/
│   │   ├── albums.ts                  # nav tree
│   │   ├── library.ts                 # nav tree helpers, photo loading, highlights
│   │   ├── config.ts                  # Cloudinary cloud name, contact email, hero photo
│   │   └── photos/                    # one JSON file per album, named by URL path with dashes
│   │       ├── family-2026-fall.json / family-2026-summer.json / ... / family-2025.json
│   │       ├── street.json
│   │       ├── events-retromobile.json / events-manhattanhenge.json / ...
│   │       ├── running-track-nyc-queens-college.json / running-nyc-half-marathon-2026.json / running-tcs-nyc-marathon-2025.json
│   │       ├── nature.json / nature-kaaterskill-falls.json
│   │       ├── travel-paris.json / travel-lancaster.json
│   │       └── 2026-<month>.json
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro                # highlights (photos flagged "highlight": true)
│   │   ├── contact.astro
│   │   └── [...path].astro            # every group landing page and album
│   └── utils/
│       └── cloudinary.ts
└── .github/workflows/deploy.yml
```

## Content Model

### Navigation

`src/data/albums.ts` exports `navItems`, the navigation tree used by `Sidebar.astro` and by `src/pages/[...path].astro` to generate pages. An item is either an `Album` (`slug`, `label`) or a `NavGroup` (`slug`, `label`, `children`). Groups can nest: Family > 2026 > Fall lives at `/family/2026/fall/`.

Every group gets a landing page with a cover card for each child. Covers use the first highlighted photo in the album (or the first photo).

### Photos

Each album has a JSON file in `src/data/photos/` named after its URL path, with `/` replaced by `-` (`family/2026/fall` → `family-2026-fall.json`). A group can have its own file too (`nature.json`); those photos show under its album cards. Each photo entry includes:

- `publicId` — Cloudinary public ID
- `album` — album name, used for fallback alt text
- `alt` — alt text
- `width` / `height` — original image dimensions
- `highlight` — optional; `true` also shows the photo on the homepage

### Highlights

The homepage shows every photo flagged `"highlight": true` in any album, newest first. To feature or unfeature a photo, edit the flag in its album's JSON.

### Family

Family is split by year, then season, using the date at the start of each filename: winter (Dec–Feb, filed under the year of its January, so December goes in the next year's winter), spring (Mar–May), summer (Jun–Aug), fall (Sep–Nov). A year without enough photos for seasons is one album (`/family/2025/`).

### Routes

- `/` — highlights
- `/<group>/` — group landing page, e.g. `/family/`, `/events/`, `/family/2026/`
- `/<group>/.../<album>/` — an album, e.g. `/family/2026/fall/`, `/events/retromobile/`
- `/street/` — a top-level album
- `/contact/` — contact page

Old URLs (`/urban`, `/little-league`, `/events/little-league`, `/manhattanhenge`, `/family/first-day-of-school-2026`, `/family/2026/<month>`) redirect via the `redirects` map in `astro.config.mjs`.

## Adding a New Album

1. Add it to the right place in `navItems` in `src/data/albums.ts`, newest first
2. Create `src/data/photos/<path-with-dashes>.json` with the photo entries
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
2. Add or edit photo entries in the relevant `src/data/photos/<path-with-dashes>.json`
3. Run `npm run build`
4. Commit and push to `main`

GitHub Actions will build and publish the site automatically.
