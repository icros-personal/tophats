import data from './generated/gallery.json';

/** One entry from the manifest written by scripts/build-gallery.mjs. */
export interface GalleryItem {
  slug: string;
  title: string;
  summary: string | null;
  /** Describes what the image shows; null if the sidecar doesn't say. Use hatAlt(). */
  alt: string | null;
  /** Plain-text start of the description, for meta descriptions. */
  excerpt: string;
  descriptionHtml: string;
  hasSidecar: boolean;
  order: number | null;
  /** Paths relative to the site base, e.g. "media/thumbs/x.webp". Use asset(). */
  thumb: string;
  full: string;
  /** 1200x630 JPEG for social-share previews. */
  og: string;
  width: number;
  height: number;
}

export const gallery = data as GalleryItem[];

/** Prefix a public path with the deploy base ("/tophats/"). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

/** Router path for a hat's page. Trailing slash: each page is a folder with index.html. */
export const hatPath = (slug: string) => `/gallery/${slug}/`;

export const hatAlt = (hat: GalleryItem) => hat.alt ?? hat.title;

export function findHat(slug: string | undefined) {
  const index = gallery.findIndex((h) => h.slug === slug);
  if (index === -1) return null;
  return {
    hat: gallery[index],
    prev: index > 0 ? gallery[index - 1] : null,
    next: index < gallery.length - 1 ? gallery[index + 1] : null,
  };
}
