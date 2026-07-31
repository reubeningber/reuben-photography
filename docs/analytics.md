# Analytics

## Cloudflare Web Analytics, manual snippet

Added July 2026, alongside the same tool being set up on the main `reubeningber.com` site. `CloudflareAnalytics.astro` hardcodes a beacon token and is included unconditionally in `Layout.astro`'s `<head>`.

## Why not automatic injection, given the record is proxied?

This subdomain's DNS record *is* proxied through Cloudflare (see [deployment.md](./deployment.md)) — unlike the main site's apex domain, where automatic injection silently failed because traffic never touched Cloudflare's proxy at all. So it would be reasonable to expect Cloudflare's "automatic injection" Web Analytics option to just work here.

It doesn't, for a different reason: Cloudflare's dashboard only offers automatic injection for hostnames that are registered as their own "website" (i.e. their own Cloudflare zone). `photos.reubeningber.com` is a subdomain *within* the `reubeningber.com` zone, not a zone of its own — when you try to add it as a Web Analytics site, Cloudflare explicitly says "this hostname does not belong to any website on your Cloudflare account" and falls back to requiring the manual JS snippet, regardless of proxy status.

So: proxied ≠ eligible for automatic injection. The eligibility test is "is this its own Cloudflare zone," not "does traffic pass through Cloudflare's edge." Manual snippet installation works regardless of either condition, which is why both sites in this project (the apex domain and this subdomain) ended up using the same manual-snippet approach for two different underlying reasons.
