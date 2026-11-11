import raw from '../site.config.json' with { type: 'json' };

/**
 * Site-wide settings, from /site.config.json. `url` is the ONE place the
 * deployed address lives: Vite's base path, canonical links, OpenGraph URLs
 * and the sitemap are all derived from it.
 */
const url = raw.url.endsWith('/') ? raw.url : `${raw.url}/`;

export const site = {
  ...raw,
  /** Absolute site URL, always with a trailing slash. */
  url,
  /** Path part of the URL, e.g. "/tophats/" or "/" for a custom domain. */
  basePath: new URL(url).pathname,
};

/** Absolute URL for a path relative to the site root, e.g. "gallery/". */
export const absoluteUrl = (path: string) => site.url + path.replace(/^\/+/, '');
