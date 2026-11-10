#!/usr/bin/env node
/**
 * Builds the gallery from whatever images live in /gallery.
 *
 *   gallery/silk-topper.png        -> the image (jpg, jpeg, png, webp, avif, gif, svg)
 *   gallery/silk-topper.md         -> OPTIONAL sidecar: YAML frontmatter + markdown body
 *
 * Sidecar frontmatter fields (all optional):
 *   title:   Display title (default: derived from the filename)
 *   summary: One-liner shown on the gallery card
 *   order:   Number; lower sorts first (default: sorted by title)
 *
 * Outputs (both gitignored, regenerated on every dev/build):
 *   public/gallery/thumbs/<slug>.webp   600x450 cover-cropped thumbnail
 *   public/gallery/full/<slug>.webp     up to 1600px wide display image
 *   src/generated/gallery.json          manifest imported by the React app
 *
 * Images whose source bytes haven't changed are skipped (content hash in
 * public/gallery/.cache.json), and outputs for deleted images are removed.
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = join(ROOT, 'gallery');
const OUT_DIR = join(ROOT, 'public', 'gallery');
const THUMB_DIR = join(OUT_DIR, 'thumbs');
const FULL_DIR = join(OUT_DIR, 'full');
const CACHE_FILE = join(OUT_DIR, '.cache.json');
const MANIFEST = join(ROOT, 'src', 'generated', 'gallery.json');

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);
const THUMB = { width: 600, height: 450 };
const FULL_MAX = 1600;
// Bump to force every image to regenerate (e.g. after changing sizes above).
const PIPELINE_VERSION = 1;

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const titleFromSlug = (slug) =>
  slug
    .split('-')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

const PLACEHOLDER_TEXT = [
  'A fine specimen of the hatter’s art. Further particulars are, regrettably, still at the milliner.',
  'Our archivists have not yet written about this one, but we are told it looks splendid at a garden party.',
  'Description forthcoming. In the meantime, please admire the silhouette.',
];

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

async function main() {
  await mkdir(THUMB_DIR, { recursive: true });
  await mkdir(FULL_DIR, { recursive: true });
  await mkdir(dirname(MANIFEST), { recursive: true });

  const files = existsSync(SRC_DIR) ? await readdir(SRC_DIR) : [];
  const images = files.filter((f) => IMAGE_EXT.has(extname(f).toLowerCase())).sort();

  const cache = await readJson(CACHE_FILE, {});
  const nextCache = {};
  const entries = [];
  const seen = new Set();
  let built = 0;

  for (const [i, file] of images.entries()) {
    const stem = basename(file, extname(file));
    const slug = slugify(stem);
    if (!slug) {
      console.warn(`  ! skipping ${file}: can't make a slug from its name`);
      continue;
    }
    if (seen.has(slug)) {
      console.warn(`  ! skipping ${file}: another image already uses slug "${slug}"`);
      continue;
    }
    seen.add(slug);

    const srcPath = join(SRC_DIR, file);
    const bytes = await readFile(srcPath);
    const hash = createHash('sha1').update(bytes).update(`v${PIPELINE_VERSION}`).digest('hex');

    const thumbPath = join(THUMB_DIR, `${slug}.webp`);
    const fullPath = join(FULL_DIR, `${slug}.webp`);
    let meta = cache[slug];

    if (!meta || meta.hash !== hash || !existsSync(thumbPath) || !existsSync(fullPath)) {
      await sharp(bytes)
        .resize({ ...THUMB, fit: 'cover', position: 'attention' })
        .webp({ quality: 80 })
        .toFile(thumbPath);
      const info = await sharp(bytes)
        .resize({ width: FULL_MAX, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(fullPath);
      meta = { hash, width: info.width, height: info.height };
      built++;
    }
    nextCache[slug] = meta;

    // Optional sidecar: same stem, .md extension.
    const sidecarPath = join(SRC_DIR, `${stem}.md`);
    let data = {};
    let body = '';
    if (existsSync(sidecarPath)) {
      const parsed = matter(await readFile(sidecarPath, 'utf8'));
      data = parsed.data ?? {};
      body = parsed.content.trim();
    }

    entries.push({
      slug,
      title: String(data.title ?? titleFromSlug(slug)),
      summary: data.summary ? String(data.summary) : null,
      descriptionHtml: body
        ? await marked.parse(body)
        : `<p>${PLACEHOLDER_TEXT[i % PLACEHOLDER_TEXT.length]}</p>`,
      hasSidecar: Boolean(body || Object.keys(data).length),
      order: typeof data.order === 'number' ? data.order : null,
      thumb: `gallery/thumbs/${slug}.webp`,
      full: `gallery/full/${slug}.webp`,
      width: meta.width,
      height: meta.height,
    });
  }

  // Remove outputs for images that no longer exist.
  let removed = 0;
  for (const slug of Object.keys(cache)) {
    if (nextCache[slug]) continue;
    await rm(join(THUMB_DIR, `${slug}.webp`), { force: true });
    await rm(join(FULL_DIR, `${slug}.webp`), { force: true });
    removed++;
  }

  entries.sort((a, b) => {
    const ao = a.order ?? Number.POSITIVE_INFINITY;
    const bo = b.order ?? Number.POSITIVE_INFINITY;
    return ao !== bo ? ao - bo : a.title.localeCompare(b.title);
  });

  await writeFile(CACHE_FILE, JSON.stringify(nextCache, null, 2));
  await writeFile(MANIFEST, JSON.stringify(entries, null, 2) + '\n');

  console.log(
    `gallery: ${entries.length} image(s) — ${built} processed, ${entries.length - built} cached, ${removed} removed`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
