/**
 * Build-time entry point: renders a route to an HTML string. Bundled by
 * `vite build --ssr` and called from scripts/prerender.mjs; never shipped to
 * the browser.
 */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { getPageMeta, headTags, prerenderPaths } from './meta';
import { site } from './site';

export { prerenderPaths, site };

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

/** @param path router path without the base, e.g. "/gallery/the-wee-topper/" */
export function render(path: string) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter basename={basename} location={basename + path}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  const meta = getPageMeta(path);
  return { html, head: headTags(meta), meta };
}

export function notFoundHead() {
  return headTags(getPageMeta('/404'));
}
