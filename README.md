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

## Project Structure

```text
.
├── public/
│   ├── CNAME
│   └── favicon*
├── src/
│   ├── components/
│   │   ├── Logo*.astro
│   │   ├── MasonryGrid.astro
│   │   └── Sidebar.astro
│   ├── data/
│   │   ├── albums.ts
│   │   ├── config.ts
│   │   └── photos/
│   │       ├── highlights.json
│   │       ├── family.json
│   │       ├── little-league.json
│   │       ├── nature.json
│   │       ├── paris.json
│   │       ├── running.json
│   │       ├── urban.json
│   │       └── 2026-<month>.json   ← add one per month as needed
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── contact.astro
│   │   ├── [album].astro
│   │   └── 2026/
│   │       └── [month].astro
│   └── utils/
│       └── cloudinary.ts
└── .github/workflows/deploy.yml
```

## Content Model

### Navigation

Album navigation lives in `src/data/albums.ts`. It exports two things:

- `navItems` — the full navigation tree, used by `Sidebar.astro`. Top-level items can be either a plain `Album` (with a `slug` and `label`) or a `NavGroup` (with a `slug`, `label`, and `children` array of `Album`s).
- `albums` — a flat list of all top-level albums, used by `[album].astro` to generate routes.

To add a new top-level album, add an entry to `navItems`. To add a new grouped sub-album (e.g. a new month under 2026), add it to the relevant `NavGroup`'s `children` array.

### Photos

Each album has its own JSON file in `src/data/photos/`. The filename must match the album's `slug`. Each photo entry includes:

- `publicId` — Cloudinary public ID
- `album` — album slug (matches the filename)
- `alt` — alt text
- `width` / `height` — original image dimensions

### Routes

- `/` — shows the `highlights` album
- `/<album>` — shows a top-level album (e.g. `/family`, `/running`)
- `/2026/<month>` — shows a monthly sub-album (e.g. `/2026/may`)
- `/contact` — contact page

## Adding a New Monthly Album (2026)

1. Add the month to the `2026` group's `children` array in `src/data/albums.ts`
2. Create `src/data/photos/2026-<month>.json` with the photo entries for that month
3. Run `npm run build`, then commit and push

## Cloudinary

Cloudinary settings are in `src/data/config.ts`:

- `CLOUD_NAME`
- `CONTACT_EMAIL`
- `HERO_PHOTO_ID`

Image URLs are assembled in `src/utils/cloudinary.ts`. If you move to a different Cloudinary account, update `CLOUD_NAME` there.

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

For GitHub Pages certificate issuance, the Cloudflare record should typically be `DNS only` rather than proxied until HTTPS is healthy.

## Updating The Site

Typical content update flow:

1. Add or edit nav items in `src/data/albums.ts`
2. Add or edit photo entries in the relevant `src/data/photos/<album>.json`
3. Run `npm run build`
4. Commit and push to `main`

GitHub Actions will build and publish the site automatically.
