export interface Album {
  slug: string;
  label: string;
}

export interface NavGroup {
  slug: string;
  label: string;
  children: Album[];
}

export type NavItem = Album | NavGroup;

export function isNavGroup(item: NavItem): item is NavGroup {
  return 'children' in item;
}

export const navItems: NavItem[] = [
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
  {
    slug: 'travel',
    label: 'Travel',
    children: [
      { slug: 'paris',     label: 'Paris' },
      { slug: 'lancaster', label: 'Lancaster, PA' },
    ],
  },
  { slug: 'family',       label: 'Family' },
  { slug: 'urban',        label: 'Street' },
  { slug: 'little-league',  label: 'Little League' },
  { slug: 'running',      label: 'Running' },
  { slug: 'manhattanhenge', label: 'Manhattanhenge' },
  { slug: 'nature',         label: 'Nature' },
];

export const albums: Album[] = navItems.filter((item): item is Album => !isNavGroup(item));
