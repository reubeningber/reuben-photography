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
      { slug: '2026/january',  label: 'January' },
      { slug: '2026/february', label: 'February' },
      { slug: '2026/march',    label: 'March' },
      { slug: '2026/april',    label: 'April' },
      { slug: '2026/may',      label: 'May' },
      { slug: '2026/june',     label: 'June' },
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
