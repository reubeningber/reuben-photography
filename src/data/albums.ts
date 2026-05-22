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
  { slug: 'family',       label: 'Family' },
  { slug: 'little-league', label: 'Little League' },
  { slug: 'nature',       label: 'Nature' },
  { slug: 'paris',        label: 'Paris' },
  { slug: 'running',      label: 'Running' },
  { slug: 'urban',        label: 'Urban' },
  {
    slug: '2026',
    label: '2026',
    children: [
      { slug: 'january',  label: 'January' },
      { slug: 'february', label: 'February' },
      { slug: 'march',    label: 'March' },
      { slug: 'april',    label: 'April' },
    ],
  },
];

export const albums: Album[] = navItems.filter((item): item is Album => !isNavGroup(item));
