import { CLOUD_NAME } from '../data/config';

const BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

export function imgUrl(publicId: string, width: number): string {
  return `${BASE}/f_auto,q_auto,w_${width}/${publicId}`;
}

export function imgSrcset(publicId: string, widths = [400, 800, 1200]): string {
  return widths.map(w => `${imgUrl(publicId, w)} ${w}w`).join(', ');
}

export function lightboxUrl(publicId: string): string {
  return `${BASE}/f_auto,q_auto,w_1600/${publicId}`;
}
