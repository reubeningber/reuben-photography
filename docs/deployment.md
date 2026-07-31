# Deployment

## GitHub Pages, custom subdomain

Deployed by `.github/workflows/deploy.yml` to GitHub Pages on every push to `main`, via the modern `actions/configure-pages` + `actions/deploy-pages` flow (no separate build/deploy split into two workflows the way the main site has — this site is small enough, and doesn't have future-dated content, so there's no need for a scheduled rebuild).

No build-time secrets are required — the Cloudinary cloud name in `src/data/config.ts` is a public, non-secret value (Cloudinary cloud names aren't credentials; they're just an account identifier baked into every image URL).

## DNS: proxied, unlike the main site

`public/CNAME` pins `photos.reubeningber.com`. The DNS record itself is a `CNAME` to `reubeningber.github.io`, and — unlike the main `reubeningber.com` apex domain, whose `A` records are DNS-only — this subdomain's record is **proxied** through Cloudflare (orange-cloud). Traffic goes browser → Cloudflare → GitHub Pages rather than straight to GitHub Pages.

This matters for two things:
- GitHub Pages' automatic HTTPS certificate issuance sometimes wants to see the origin directly during initial setup; if it's ever stuck on a fresh domain, temporarily flipping the record to DNS-only and back can unstick it.
- Cloudflare features that depend on the proxy (see [analytics.md](./analytics.md)) are actually available here, unlike on the apex domain — but that doesn't mean every such feature works automatically; see below.

## Old URLs

Some album URLs moved when the nav was reorganized into groups. `astro.config.mjs`'s `redirects` config generates static redirect stubs so old links (`/manhattanhenge`, `/little-league`, `/2026/<month>`) still resolve — see [content-model.md](./content-model.md).
