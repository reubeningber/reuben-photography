export interface Album {
  slug: string;
  label: string;
}

export interface NavGroup {
  slug: string;
  label: string;
  children: Album[];
  /** When true, the group's own label links to `/${slug}` in addition to expanding its children. */
  hasOwnPage?: boolean;
}

export type NavItem = Album | NavGroup;

export function isNavGroup(item: NavItem): item is NavGroup {
  return 'children' in item;
}

export const navItems: NavItem[] = [
  {
    slug: 'travel',
    label: 'Travel',
    children: [
      { slug: 'paris',     label: 'Paris' },
      { slug: 'lancaster', label: 'Lancaster, PA' },
    ],
  },
  {
    slug: 'family',
    label: 'Family',
    hasOwnPage: true,
    children: [
      { slug: 'first-day-of-school-2026', label: 'First Day of School 2026' },
    ],
  },
  {
    slug: '2026',
    label: '2026',
    children: [
      { slug: 'january',  label: 'January' },
      { slug: 'february', label: 'February' },
      { slug: 'march',    label: 'March' },
      { slug: 'april',    label: 'April' },
      { slug: 'may',      label: 'May' },
      { slug: 'june',     label: 'June' },
    ],
  },
  { slug: 'urban',        label: 'Street' },
  {
    slug: 'running',
    label: 'Running',
    hasOwnPage: true,
    children: [
      { slug: 'track-nyc-queens-college', label: 'Trials of Miles Track Morning' },
    ],
  },
  { slug: 'nature',         label: 'Nature' },
  {
    slug: 'events',
    label: 'Events',
    children: [
      { slug: 'manhattanhenge', label: 'Manhattanhenge' },
      { slug: 'little-league',  label: 'Little League' },
    ],
  },
];

export const albums: Album[] = navItems.filter((item): item is Album => !isNavGroup(item));
