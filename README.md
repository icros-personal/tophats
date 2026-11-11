# Top Hats 4 All 🎩

A prototype WordPress-style site (logo + nav header that shrinks on scroll, hero front page,
generated gallery, contact page) built with Vite, React and TypeScript for GitHub Pages.
Every page is pre-rendered to static HTML at build time, with its own title, description and
social-share (OpenGraph) tags.

## Quick start

```bash
npm install
npm run dev        # builds the gallery, then starts Vite at http://localhost:5173/tophats/
npm run build      # gallery → type-check → client bundle → pre-render pages into dist/
npm run preview    # serves dist/ locally, as GitHub Pages would
```

## Adding / removing gallery images

Drop images into [`gallery/`](gallery/) (jpg, png, webp, avif, gif, svg) and commit. The deploy
workflow regenerates thumbnails, share images, pages and the sitemap. Delete an image and it
disappears from the site on the next deploy.

The URL slug comes from the filename: `gallery/Velvet Teal.png` → `/tophats/gallery/velvet-teal/`.

An **optional** sidecar markdown file with the same name adds details:

```markdown
<!-- gallery/velvet-teal.md -->
---
title: Velvet Teal
summary: Shown on the gallery card, and as the page's search/share description.
alt: A teal top hat with a coral band and a yellow feather, tilted to the right
order: 3          # optional; lower numbers sort first, otherwise alphabetical by title
---
Markdown body becomes the description on the hat's page.
```

Without a sidecar, the title comes from the filename, the alt text falls back to the title,
and a placeholder description is used. **`alt` is worth writing:** it's what screen-reader users
hear in place of the image, so describe what the picture shows rather than repeating its name.

`npm run placeholders` regenerates the stylized demo hats (`-- --force` to overwrite).

## Changing the site's address

The deployed URL lives in **one place**, [`site.config.json`](site.config.json):

```json
{ "url": "https://icros-personal.github.io/tophats/", ... }
```

Everything else is derived from it: Vite's base path (`/tophats/`), canonical links, OpenGraph
URLs, the sitemap, and whether a `robots.txt` is written.

- **Renamed repo:** project sites live at `https://<user>.github.io/<repo>/`, so update the
  path to match the new repo name.
- **Custom domain** (e.g. `https://tophats.example/`): set `url` to it, then in the repo's
  **Settings → Pages** enter the domain and add the DNS records GitHub shows you. The site then
  runs from `/`, and the build also writes `robots.txt`. No `CNAME` file is needed when
  deploying with GitHub Actions.
- **User/org site** (repo named `<user>.github.io`): set `url` to `https://<user>.github.io/`.

## How it works

- **Gallery:** `scripts/build-gallery.mjs` runs before `dev` and `build`. It uses `sharp` to write
  a 600×450 thumbnail, a ≤1600px display image (WebP) and a 1200×630 share image (JPEG) per hat to
  `public/media/`, plus a manifest at `src/generated/gallery.json`. Both are gitignored.
  Unchanged images are skipped (content hash), and the workflow caches `public/media/` between
  runs.
- **Pre-rendering:** after the normal client build, `vite build --ssr` bundles
  `src/entry-server.tsx`, and `scripts/prerender.mjs` renders every route to its own
  `index.html` (`dist/gallery/the-wee-topper/index.html`, …), with that page's `<head>` tags from
  `src/meta.ts`. In the browser React **hydrates** that HTML, attaching to it instead of
  re-rendering, and from then on behaves as a normal single-page app.
  - Each page is a folder with an `index.html`, so canonical URLs end in `/`. GitHub Pages
    redirects `/gallery` to `/gallery/` automatically.
  - Hydration needs the first browser render to match the build-time HTML, so anything that
    varies by time, randomness or browser (e.g. the footer's "Hat Fact of the Day") is chosen in
    a `useEffect` after hydration.
- **SEO extras:** `dist/sitemap.xml` lists every page; `404.html` is marked `noindex`.
  `robots.txt` is only written when the site is at a domain root, because crawlers only read
  it there.

## Deploying

Push to `main` on GitHub, then in the repo's **Settings → Pages** set **Source** to
**GitHub Actions**. The workflow is in `.github/workflows/deploy.yml`.

After the first deploy, you can submit `https://icros-personal.github.io/tophats/sitemap.xml`
in [Google Search Console](https://search.google.com/search-console) to speed up indexing.
