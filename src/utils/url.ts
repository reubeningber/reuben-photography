/**
 * Internal page URLs are always the trailing-slash form: GitHub Pages
 * 301-redirects `/family` to `/family/`, and Search Console reports every
 * slash-less internal link as a "Page with redirect".
 */

/** Build an internal page href from path segments, e.g. `pageHref('2026', 'may')` → `/2026/may/`. */
export function pageHref(...segments: string[]): string {
  const path = segments.filter(Boolean).join('/');
  return path ? `/${path}/` : '/';
}

/** Normalize an already-built page path to the trailing-slash form. */
export function withTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}
