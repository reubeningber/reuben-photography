export interface Album {
  slug: string;
  label: string;
}

/**
 * A group of albums (or nested groups). Every group gets a landing page at its
 * path showing a cover card per child, followed by any photos in the group's
 * own JSON file (e.g. `nature.json`).
 */
export interface NavGroup {
  slug: string;
  label: string;
  children: NavItem[];
}

export type NavItem = Album | NavGroup;

export function isNavGroup(item: NavItem): item is NavGroup {
  return 'children' in item;
}

// Children are listed newest first. Family is split by year, then by season
// (winter = Dec–Feb of the same calendar year); a year with too few photos for
// seasons, like 2025, is a single album.
export const navItems: NavItem[] = [
  {
    slug: 'family',
    label: 'Family',
    children: [
      {
        slug: '2026',
        label: '2026',
        children: [
          { slug: 'fall',                label: 'Fall' },
          { slug: 'first-day-of-school', label: 'First Day of School' },
          { slug: 'summer',              label: 'Summer' },
          { slug: 'spring',              label: 'Spring' },
          { slug: 'winter',              label: 'Winter' },
        ],
      },
      { slug: '2025', label: '2025' },
    ],
  },
  { slug: 'street', label: 'Street' },
  {
    slug: 'events',
    label: 'Events',
    children: [
      { slug: 'retromobile',               label: 'Retromobile Car Meet' },
      { slug: 'adorama-x-flower-district', label: 'Adorama x Flower District' },
      { slug: 'manhattanhenge',            label: 'Manhattanhenge' },
    ],
  },
  {
    slug: 'running',
    label: 'Running',
    children: [
      { slug: 'track-nyc-queens-college', label: 'Trials of Miles Track Morning' },
    ],
  },
  {
    slug: 'nature',
    label: 'Nature',
    children: [
      { slug: 'kaaterskill-falls', label: 'Kaaterskill Falls' },
    ],
  },
  {
    slug: 'travel',
    label: 'Travel',
    children: [
      { slug: 'lancaster', label: 'Lancaster, PA' },
      { slug: 'paris',     label: 'Paris' },
    ],
  },
  {
    slug: '2026',
    label: '2026',
    children: [
      { slug: 'june',     label: 'June' },
      { slug: 'may',      label: 'May' },
      { slug: 'april',    label: 'April' },
      { slug: 'march',    label: 'March' },
      { slug: 'february', label: 'February' },
      { slug: 'january',  label: 'January' },
    ],
  },
];

/** Top-level albums that aren't in a group. */
export const albums: Album[] = navItems.filter((item): item is Album => !isNavGroup(item));
