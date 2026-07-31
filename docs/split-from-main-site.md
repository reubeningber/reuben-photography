# Why this is a separate repo

Photo galleries used to be part of `reubeningber.com` — an `albums` content collection, `PhotoGrid.astro`/`PhotoGridWithLightbox.astro`, and PhotoSwipe for the lightbox. This repo is what replaced all of that.

## Timeline (from `reubeningber.com`'s git history)

- **May 7, 2026** — the main site's `PHOTOS` nav link switched to pointing at `photos.reubeningber.com` ("Move photos navigation to external site"), the same day this repo's first commits landed.
- **May 26, 2026** — the now-redundant photo pages, components, and album JSON were deleted from the main repo entirely ("Remove photos").

## Why split it out

This site is a dedicated photography portfolio with its own design language (fixed sidebar nav, custom SVG logo, masonry grid, hand-rolled lightbox — see [architecture.md](./architecture.md)) modeled on a photography-portfolio reference site, not the blog's design system. Splitting it out means:

- The photography site can move independently — new layout, new lightbox behavior, new nav structure — without touching or risking the blog.
- Photography-specific dependencies and tooling (the Cloudinary upload script, album/photo JSON conventions) live where they're actually used instead of bloating a blog repo that otherwise has none of that.
- Each site gets simpler AGENTS.md/README docs, since there's no split-personality "this repo does two very different things" to explain.

The cost: no shared layout or design system between the two sites. The main site's `Header.astro`/`Footer.astro` link here as a plain external link (`target="_blank"`), and that's the entire integration surface between the two repos.
