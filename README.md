# Top Hats 4 All 🎩

A prototype WordPress-style site (logo + nav header that shrinks on scroll, hero front page,
generated gallery, contact page) built with Vite, React and TypeScript for GitHub Pages.

## Quick start

```bash
npm install
npm run dev        # builds the gallery, then starts Vite at http://localhost:5173/tophats/
npm run build      # builds the gallery, type-checks, bundles into dist/
npm run preview    # serves dist/ locally
```

## Adding / removing gallery images

Drop images into [`gallery/`](gallery/) (jpg, png, webp, avif, gif, svg) and commit. That's it:
the deploy workflow regenerates thumbnails and the manifest. Delete an image and it disappears
from the site on the next deploy.

The URL slug comes from the filename: `gallery/Velvet Teal.png` → `/tophats/gallery/velvet-teal`.

An **optional** sidecar markdown file with the same name adds a title, summary and description:

```markdown
<!-- gallery/velvet-teal.md -->
---
title: Velvet Teal
summary: Shown on the gallery card.
order: 3          # optional; lower numbers sort first, otherwise alphabetical by title
---
Markdown body becomes the description on the hat's page.
```

Without a sidecar the title is derived from the filename and a placeholder description is used.

`npm run placeholders` regenerates the stylized demo hats (`-- --force` to overwrite).

## How it works

- `scripts/build-gallery.mjs` runs before `dev` and `build`. It uses `sharp` to write a 600×450
  thumbnail and a ≤1600px display image (WebP) to `public/gallery/`, and a manifest to
  `src/generated/gallery.json`. Both are gitignored. Unchanged images are skipped via a content
  hash, and the workflow caches `public/gallery/` between runs.
- Clean URLs on GitHub Pages: the build copies `index.html` to `404.html`, so deep links like
  `/tophats/gallery/midnight-plum` load the app and React Router takes over.
- The site is served under `/tophats/` (`base` in `vite.config.ts`). Change it there if the repo
  name changes.

## Deploying

Push to `main` on GitHub, then in the repo's **Settings → Pages** set **Source** to
**GitHub Actions**. The workflow is in `.github/workflows/deploy.yml`.
