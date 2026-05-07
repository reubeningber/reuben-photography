export interface Album {
  slug: string;
  label: string;
}

export const albums: Album[] = [
  { slug: 'family',       label: 'Family' },
  { slug: 'little-league', label: 'Little League' },
  { slug: 'nature',       label: 'Nature' },
  { slug: 'paris',        label: 'Paris' },
  { slug: 'running',      label: 'Running' },
  { slug: 'urban',        label: 'Urban' },
];
