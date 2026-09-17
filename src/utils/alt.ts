function humanizeAlbum(album: string): string {
  return album.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function extractDate(publicId: string): string | null {
  const match = publicId.match(/(\d{4})(\d{2})(\d{2})/);
  if (!match) return null;
  const [, year, month] = match;
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function fallbackAlt(album: string, publicId: string): string {
  const label = humanizeAlbum(album);
  const date = extractDate(publicId);
  return date ? `${label} photo, ${date}` : `${label} photo`;
}
