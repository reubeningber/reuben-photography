# Architecture

## The stack

- **Astro 6**, `output: 'static'` — no server, no SSR, no client framework. Every route is a static HTML file generated at build time.
- **No CSS framework.** Unlike the main `reubeningber.com` site (Tailwind), styling here is hand-written CSS in `Layout.astro`'s `<style is:global>` block — a handful of custom properties (`--bg`, `--text`, `--sidebar-w`, etc.) and plain rules.
- **No content collections, no CMS, no Zod schema.** Content is two hand-maintained TypeScript/JSON sources: `src/data/albums.ts` (the nav tree) and `src/data/photos/*.json` (one file per album). See [content-model.md](./content-model.md).
- **Cloudinary** for every image, same as the main site — URLs built at render time in `src/utils/cloudinary.ts`, not stored as static assets.

## History of the design

The repo started May 7, 2026 as a fresh Astro project (same day the main site's nav switched to linking here — see [split-from-main-site.md](./split-from-main-site.md)), and went through its current look within that first day:

1. Initial scaffold, then real albums/photos loaded in
2. Homepage became a masonry grid of highlight photos
3. A custom inline SVG logo system landed (4 variants: stacked/horizontal × light/dark, picked per context)
4. A full redesign to the current fixed left-rail sidebar layout, explicitly modeled on brittanybravo.com's photography-portfolio layout

## The lightbox

`MasonryGrid.astro` renders both the photo grid and a hand-rolled lightbox (no PhotoSwipe, no external library — unlike the main site's now-removed PhotoSwipe integration). It supports keyboard nav (arrows, Escape), touch swipe, and click-outside-to-close.

Deep-linking went through two designs on the same day (May 29, 2026):

1. **Hash-based** (`#photo-{index}`) — first attempt, keyed by the photo's position in the array.
2. **Query-param, ID-based** (`?photo={publicId filename}`) — replaced it same day. Keying by index breaks if photos are ever reordered or removed; keying by the Cloudinary public ID's filename doesn't. Opening a photo sets `?photo=...` in the URL, prev/next keeps it in sync, closing strips it, and loading a URL with that param auto-opens the matching photo.

## Nav model

Two shapes, defined in `src/data/albums.ts`:

- **`Album`** — a plain leaf: `{ slug, label }`.
- **`NavGroup`** — `{ slug, label, children: Album[], hasOwnPage? }`. Groups render as expandable sections in `Sidebar.astro`. `hasOwnPage: true` (used by Family and Running) means the group label is itself a link to a landing page in addition to expanding to show its children — most groups (Travel, Events) are navigation-only and have no page of their own at their group slug.

This two-level model (flat albums vs. groups-with-children) is deliberately shallow — there's no arbitrary nesting depth, because the routing (see [content-model.md](./content-model.md)) is hand-written per group rather than generated generically from the tree shape.
