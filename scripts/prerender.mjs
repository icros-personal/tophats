#!/usr/bin/env node
/**
 * Runs after `vite build` (client) and `vite build --ssr` (dist-ssr/).
 *
 * For every route, renders the React app to HTML and writes it, with that
 * page's <title>/description/OpenGraph tags, as a real file:
 *
 *   dist/index.html
 *   dist/gallery/index.html
 *   dist/gallery/<slug>/index.html
 *   dist/contact/index.html
 *
 * so GitHub Pages serves each page with a 200 status and complete HTML. In the
 * browser React then hydrates that HTML instead of rendering from scratch.
 *
 * Also writes:
 *   dist/404.html     unknown URLs; renders client-side, marked noindex
 *   dist/sitemap.xml  every pre-rendered page
 *   dist/robots.txt   only when the site is at a domain root (crawlers ignore
 *                     robots.txt in a subfolder like /tophats/)
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const SSR_DIR = join(ROOT, 'dist-ssr');

const { render, notFoundHead, prerenderPaths, site } = await import(
  pathToFileURL(join(SSR_DIR, 'entry-server.js')).href
);

const template = await readFile(join(DIST, 'index.html'), 'utf8');
const ROOT_DIV = '<div id="root"></div>';
const HEAD_MARK = '<!--app-head-->';
if (!template.includes(ROOT_DIV) || !template.includes(HEAD_MARK)) {
  throw new Error(`index.html must contain ${ROOT_DIV} and ${HEAD_MARK}`);
}

function page(head, html = '') {
  return template
    .replace(/<title>[\s\S]*?<\/title>\s*/, '') // the dev-only fallback title
    .replace(HEAD_MARK, head)
    .replace(ROOT_DIV, `<div id="root">${html}</div>`);
}

const paths = prerenderPaths();
for (const path of paths) {
  const { html, head } = render(path);
  const file = join(DIST, path, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, page(head, html));
}

// Empty root: React renders it client-side for whatever URL was requested.
await writeFile(join(DIST, '404.html'), page(notFoundHead()));

const xmlEsc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const sitemapUrl = `${site.url}sitemap.xml`;
await writeFile(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${xmlEsc(site.url + p.replace(/^\//, ''))}</loc></url>`).join('\n')}
</urlset>
`,
);

if (site.basePath === '/') {
  await writeFile(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`);
}

await rm(SSR_DIR, { recursive: true, force: true });

console.log(
  `prerender: ${paths.length} page(s) + 404.html, sitemap.xml${site.basePath === '/' ? ', robots.txt' : ''} → ${site.url}`,
);
