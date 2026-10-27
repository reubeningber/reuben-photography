import { navItems, isNavGroup } from './albums';
import type { NavItem } from './albums';

export interface Photo {
  publicId: string;
  album: string;
  alt: string;
  width: number;
  height: number;
  /** Also show this photo on the homepage. */
  highlight?: boolean;
}

/** A nav item plus where it sits: its URL path and the items above it. */
export interface NavNode {
  item: NavItem;
  /** URL path without slashes at either end, e.g. `family/2026/fall`. */
  path: string;
  /** Labels from the top-level item down to this one. */
  trail: string[];
  children: NavNode[];
}

const photoModules = import.meta.glob<{ default: Photo[] }>('./photos/*.json', { eager: true });

/** The album's own photos, from `photos/<path with / replaced by ->.json`. */
export function ownPhotos(path: string): Photo[] {
  return photoModules[`./photos/${path.replace(/\//g, '-')}.json`]?.default ?? [];
}

function toNode(item: NavItem, parent?: NavNode): NavNode {
  const node: NavNode = {
    item,
    path: parent ? `${parent.path}/${item.slug}` : item.slug,
    trail: parent ? [...parent.trail, item.label] : [item.label],
    children: [],
  };
  if (isNavGroup(item)) node.children = item.children.map(child => toNode(child, node));
  return node;
}

export const navTree: NavNode[] = navItems.map(item => toNode(item));

/** Every group and album in the nav, parents before children. */
export function allNodes(nodes: NavNode[] = navTree): NavNode[] {
  return nodes.flatMap(node => [node, ...allNodes(node.children)]);
}

/** A node's own photos followed by all of its descendants' photos. */
export function allPhotos(node: NavNode): Photo[] {
  return [...ownPhotos(node.path), ...node.children.flatMap(allPhotos)];
}

/** First highlighted photo, falling back to the first photo. */
export function coverPhoto(photos: Photo[]): Photo | undefined {
  return photos.find(p => p.highlight) ?? photos[0];
}

function fileDate(photo: Photo): string {
  return photo.publicId.match(/(\d{8})-[^/]*$/)?.[1] ?? '';
}

/** "Oct 2026", "Jul – Oct 2026" or "Jul 2025 – Feb 2026", from the dates in the filenames. */
export function dateRange(photos: Photo[]): string {
  const dates = photos.map(fileDate).filter(Boolean).sort();
  if (!dates.length) return '';
  const fmt = (d: string, withYear: boolean) =>
    new Date(Number(d.slice(0, 4)), Number(d.slice(4, 6)) - 1, 1)
      .toLocaleDateString('en-US', withYear ? { month: 'short', year: 'numeric' } : { month: 'short' });
  const first = dates[0], last = dates[dates.length - 1];
  if (first.slice(0, 6) === last.slice(0, 6)) return fmt(first, true);
  if (first.slice(0, 4) === last.slice(0, 4)) return `${fmt(first, false)} – ${fmt(last, true)}`;
  return `${fmt(first, true)} – ${fmt(last, true)}`;
}

/**
 * Photos flagged `highlight: true` in any album, newest first. A photo flagged
 * in two albums (e.g. Family and a 2026 month) appears once.
 */
export function highlights(): Photo[] {
  const seen = new Set<string>();
  return Object.values(photoModules)
    .flatMap(m => m.default)
    .filter(p => p.highlight)
    .sort((a, b) => fileDate(b).localeCompare(fileDate(a)))
    .filter(p => {
      const name = p.publicId.split('/').pop()!;
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    });
}
