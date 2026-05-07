# Reuben Photography

Photography portfolio site for Reuben Ingber, built with Astro and deployed to `photos.reubeningber.com`.

## Overview

This repo contains the standalone photography site that was split out from the main `reubeningber.com` site. It is a static Astro project with:

- a fixed desktop sidebar and mobile drawer navigation
- a custom inline SVG logo system
- album routes generated from local data
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

Local dev runs on Astro’s default port, usually `http://localhost:4321`.

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
│   │   └── photos.json
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── contact.astro
│   │   └── [album].astro
│   └── utils/
│       └── cloudinary.ts
└── .github/workflows/deploy.yml
```

## Content Model

Album navigation lives in [src/data/albums.ts](/Users/ringber/code/personal/reuben-photography/src/data/albums.ts).

Photo records live in [src/data/photos.json](/Users/ringber/code/personal/reuben-photography/src/data/photos.json). Each item includes:

- `publicId`
- `album`
- `alt`
- `width`
- `height`
- optional `caption`

Routes are generated from the album list:

- `/` shows the `highlights` album
- `/<album>` shows all photos for that album
- `/contact` shows the contact page

## Cloudinary

Cloudinary settings are currently hardcoded in [src/data/config.ts](/Users/ringber/code/personal/reuben-photography/src/data/config.ts):

- `CLOUD_NAME`
- `CONTACT_EMAIL`
- `HERO_PHOTO_ID`

Image URLs are assembled in [src/utils/cloudinary.ts](/Users/ringber/code/personal/reuben-photography/src/utils/cloudinary.ts).

If you move this project to a different Cloudinary account, update `CLOUD_NAME` there.

## Branding And Layout

The logo is drawn directly in [src/components/Logo.astro](/Users/ringber/code/personal/reuben-photography/src/components/Logo.astro), with separate wrappers for stacked and horizontal variants.

Navigation and mobile drawer behavior live in [src/components/Sidebar.astro](/Users/ringber/code/personal/reuben-photography/src/components/Sidebar.astro).

Global page framing, favicons, and tab title live in [src/layouts/Layout.astro](/Users/ringber/code/personal/reuben-photography/src/layouts/Layout.astro).

## Deployment

This repo is configured for GitHub Pages in [.github/workflows/deploy.yml](/Users/ringber/code/personal/reuben-photography/.github/workflows/deploy.yml).

Deployment assumptions:

- Astro `site` is set to `https://photos.reubeningber.com` in [astro.config.mjs](/Users/ringber/code/personal/reuben-photography/astro.config.mjs)
- [public/CNAME](/Users/ringber/code/personal/reuben-photography/public/CNAME) contains `photos.reubeningber.com`
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

1. Add or edit album labels in `src/data/albums.ts`
2. Add or edit photo entries in `src/data/photos.json`
3. Run `npm run build`
4. Commit and push to `main`

GitHub Actions will build and publish the site automatically.
