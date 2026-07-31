# Content model

## Two files per piece of content

Adding or changing an album always touches two places:

1. **`src/data/albums.ts`** — the nav entry (`navItems`), which also determines routing. Only plain `Album`s that sit at the top level of `navItems` get automatically routed, via `src/pages/[album].astro`'s `getStaticPaths` reading the derived `albums` list. Right now that's just `urban` and `nature` — everything else (Travel, Family, Running, Events) is a `NavGroup`, and each group has its own hand-written route file (`family/index.astro` + `family/2026/[month].astro`, `running/index.astro` + `running/[album].astro`, `travel/[album].astro`, `events/[album].astro`).
2. **`src/data/photos/<slug>.json`** — the actual photo list for that album. Filename must match the slug, with `/` replaced by `-` (a `family` child with slug `2026/may` lives at `src/data/photos/2026-may.json`).

There's no schema validation (no Zod, unlike the main site's content collections) — a malformed photo JSON file fails at build time with whatever error `import.meta.glob` or the JSON parser throws, not a friendly validation message.

## Why grouped albums aren't generic

It would be possible to write one generic `[...group]/[album].astro` catch-all that reads `navItems` and routes any group automatically. That's not what happened — each group (`family`, `running`, `travel`, `events`) got its own route file, written by hand as the group was added. The tradeoff: adding a *new* top-level group means writing a new route file (see `AGENTS.md`'s "Adding Content" section for the exact pattern), but the routing logic for each group stays simple and readable rather than generic and parameterized.

## Getting photos in

`scripts/upload-to-cloudinary.mjs` is a standalone Node script (added May 11, 2026, "Add May 9 little-league photos and Cloudinary upload script") — it signs and uploads a folder of images straight to Cloudinary's API using `CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET`, no SDK dependency. It only uploads; it never touches `albums.ts` or the photos JSON. Getting a shoot fully live is still a two-step, partly manual process: run the script, then hand-write the JSON entries (and nav entry, if new) using the public IDs it prints out.

## Redirects for renamed/moved slugs

When the nav was reorganized into groups (Events, Family nesting), some album URLs moved — `/manhattanhenge` and `/little-league` became `/events/manhattanhenge` and `/events/little-league`; `/2026/<month>` became `/family/2026/<month>`. Rather than break old links (including ones already shared), `astro.config.mjs`'s `redirects` map generates static redirect pages from each old path to its new one. If a slug moves again, add it there.
