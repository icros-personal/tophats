import data from './generated/gallery.json';

/** One entry from the manifest written by scripts/build-gallery.mjs. */
export interface GalleryItem {
  slug: string;
  title: string;
  summary: string | null;
  descriptionHtml: string;
  hasSidecar: boolean;
  order: number | null;
  /** Path relative to the site base, e.g. "gallery/thumbs/x.webp". Use asset(). */
  thumb: string;
  full: string;
  width: number;
  height: number;
}

export const gallery = data as GalleryItem[];

/** Prefix a public path with the deploy base ("/tophats/"). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export function findHat(slug: string | undefined) {
  const index = gallery.findIndex((h) => h.slug === slug);
  if (index === -1) return null;
  return {
    hat: gallery[index],
    prev: index > 0 ? gallery[index - 1] : null,
    next: index < gallery.length - 1 ? gallery[index + 1] : null,
  };
}
