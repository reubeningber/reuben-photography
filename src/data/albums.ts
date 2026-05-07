export interface Album {
  slug: string;
  label: string;
}

export const albums: Album[] = [
  { slug: 'people', label: 'People' },
  { slug: 'running', label: 'Running' },
  { slug: 'city', label: 'City' },
];
