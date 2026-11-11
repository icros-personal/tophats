import { findHat, gallery, hatAlt } from './gallery';
import { absoluteUrl, site } from './site';

/**
 * Everything that goes in a page's <head>: title, description, canonical URL
 * and OpenGraph/Twitter card tags. Used by the pre-renderer to write each
 * page's HTML, and by the app to keep document.title in sync while navigating.
 */
export interface PageMeta {
  title: string;
  description: string;
  /** Canonical path relative to the site root, e.g. "gallery/" ("" = home). */
  path: string;
  type: 'website' | 'article';
  image: { path: string; alt: string; width: number; height: number } | null;
  noindex?: boolean;
}

const OG_SIZE = { width: 1200, height: 630 };

const withSite = (title: string) => `${title} – ${site.name}`;

/** Default share image: the first hat in the gallery. */
function defaultImage(): PageMeta['image'] {
  const hat = gallery[0];
  return hat ? { path: hat.og, alt: hatAlt(hat), ...OG_SIZE } : null;
}

const NOT_FOUND: PageMeta = {
  title: withSite('Page not found'),
  description: 'We looked in every hat. This page isn’t in any of them.',
  path: '404.html',
  type: 'website',
  image: null,
  noindex: true,
};

/** Metadata for a router pathname (no base path), e.g. "/gallery/the-wee-topper/". */
export function getPageMeta(pathname: string): PageMeta {
  const parts = pathname.split('/').filter(Boolean);
  const [section, slug, ...rest] = parts;

  if (parts.length === 0) {
    return {
      title: `${site.name} – ${site.tagline}`,
      description: site.description,
      path: '',
      type: 'website',
      image: defaultImage(),
    };
  }
  if (section === 'gallery' && !slug) {
    return {
      title: withSite('Gallery'),
      description: `Browse ${gallery.length} distinguished top hats — silk, velvet, feathered, and some worn by small round creatures.`,
      path: 'gallery/',
      type: 'website',
      image: defaultImage(),
    };
  }
  if (section === 'gallery' && slug && rest.length === 0) {
    const found = findHat(slug);
    if (!found) return NOT_FOUND;
    const { hat } = found;
    return {
      title: withSite(hat.title),
      description: hat.summary ?? hat.excerpt,
      path: `gallery/${hat.slug}/`,
      type: 'article',
      image: { path: hat.og, alt: hatAlt(hat), ...OG_SIZE },
    };
  }
  if (section === 'contact' && !slug) {
    return {
      title: withSite('Contact'),
      description: 'Questions, fittings, or hat-related confessions — get in touch with Top Hats 4 All.',
      path: 'contact/',
      type: 'website',
      image: defaultImage(),
    };
  }
  return NOT_FOUND;
}

/** Every route the pre-renderer should write an HTML file for (router paths). */
export function prerenderPaths(): string[] {
  return ['/', '/gallery/', '/contact/', ...gallery.map((h) => `/gallery/${h.slug}/`)];
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The <head> tags for a page, as an HTML string. */
export function headTags(meta: PageMeta): string {
  const url = absoluteUrl(meta.path);
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    meta.noindex ? `<meta name="robots" content="noindex" />` : `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta name="twitter:card" content="${meta.image ? 'summary_large_image' : 'summary'}" />`,
  ];
  if (meta.image) {
    tags.push(
      `<meta property="og:image" content="${esc(absoluteUrl(meta.image.path))}" />`,
      `<meta property="og:image:width" content="${meta.image.width}" />`,
      `<meta property="og:image:height" content="${meta.image.height}" />`,
      `<meta property="og:image:alt" content="${esc(meta.image.alt)}" />`,
    );
  }
  return tags.join('\n    ');
}
