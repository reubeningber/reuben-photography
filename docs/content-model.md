# Content model

## Two files per piece of content

Adding or changing an album always touches two places:

1. **`src/data/albums.ts`** — the nav entry (`navItems`), which also determines routing. `src/pages/[...path].astro` walks the tree (via `src/data/library.ts`) and generates a page for every node: a landing page with album cards for each group, a masonry grid for each album.
2. **`src/data/photos/<path>.json`** — the photo list, named by the node's URL path with `/` replaced by `-` (`family/2026/fall` → `family-2026-fall.json`).

There's no schema validation (no Zod, unlike the main site's content collections) — a malformed photo JSON file fails at build time with whatever error `import.meta.glob` or the JSON parser throws, not a friendly validation message.

## Why routing became generic

Until October 2026 each group had its own hand-written route file (`family/`, `running/`, `nature/`, `travel/`, `events/`, `2026/`). By then there were six near-identical copies. Groups without one (Travel, Events, 2026) 404'd at their own URL, and Family needed a third level (year > season). One catch-all `[...path].astro` replaced them all. Adding a group or nesting level is now only a data change.

## Highlights are a flag, not a file

The homepage used to read a separate `highlights.json` whose entries were separate Cloudinary uploads (`portfolio/highlights/...`) of photos that were also in albums. Now a photo is featured by adding `"highlight": true` to its album entry. It shows on the homepage and stays in its album, and the album's landing card uses it as the cover.

## Getting photos in

`scripts/upload-to-cloudinary.mjs` is a standalone Node script (added May 11, 2026, "Add May 9 little-league photos and Cloudinary upload script") — it signs and uploads a folder of images straight to Cloudinary's API using `CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET`, no SDK dependency. It only uploads; it never touches `albums.ts` or the photos JSON. Getting a shoot fully live is still a two-step, partly manual process: run the script, then hand-write the JSON entries (and nav entry, if new) using the public IDs it prints out.

## Redirects for renamed/moved slugs

When the nav was reorganized into groups (Events, Family nesting), some album URLs moved — `/manhattanhenge` and `/little-league` became `/events/manhattanhenge` and `/events/little-league`; `/2026/<month>` became `/family/2026/<month>`. Rather than break old links (including ones already shared), `astro.config.mjs`'s `redirects` map generates static redirect pages from each old path to its new one. The October 2026 reorganization added more (`/urban` → `/street/`, Little League → `/family/2026/spring/`, First Day of School → `/family/2026/first-day-of-school/`). If a slug moves again, add it there.
