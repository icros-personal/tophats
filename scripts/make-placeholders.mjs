#!/usr/bin/env node
/**
 * Generates stylized top-hat placeholder images (and a few sidecars) into
 * /gallery so the pipeline has something to show. Existing files are left
 * alone unless you pass --force.
 *
 *   npm run placeholders            # create any that are missing
 *   npm run placeholders -- --force # regenerate all of them
 */
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'gallery');
const FORCE = process.argv.includes('--force');
const W = 1600;
const H = 1200;

// ---------- helpers ----------
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c) => Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const star = (x, y, r, fill, rot = 0) => {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2 + rot;
    const rr = i % 2 ? r * 0.45 : r;
    pts.push(`${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}"/>`;
};

// ---------- the hat, drawn around (0,0) = centre of the brim ----------
function hat(o) {
  const { color, band, height: h, crownBottom: bw, crownTop: tw, brim: brimW } = o;
  const bandH = o.bandHeight ?? 70;
  const ryb = (bw / 2) * 0.2;
  const ryt = (tw / 2) * 0.2;
  const brimRx = brimW / 2;
  const brimRy = brimRx * 0.2;
  const wAt = (y) => bw + (tw - bw) * (-y / h);
  const w1 = wAt(-bandH);
  const ry1 = (w1 / 2) * 0.2;

  const shine = (() => {
    const y0 = -bandH - 10;
    const y1 = -h + ryt + 10;
    const x = (y, f) => -wAt(y) / 2 + f * wAt(y);
    return `<polygon points="${x(y0, 0.14)},${y0} ${x(y0, 0.24)},${y0} ${x(y1, 0.24)},${y1} ${x(y1, 0.14)},${y1}" fill="#fff" opacity="0.13"/>`;
  })();

  let deco = '';
  const bandMidY = -bandH / 2;
  if (o.deco === 'feather') {
    const x = w1 / 2 - 40;
    const y = bandMidY;
    const fc = o.decoColor ?? '#ef6f5e';
    deco = `
      <path d="M ${x} ${y} C ${x + 70} ${y - 120}, ${x + 50} ${y - 270}, ${x + 170} ${y - 360}
               C ${x + 100} ${y - 250}, ${x + 120} ${y - 110}, ${x} ${y} Z" fill="${fc}"/>
      <path d="M ${x} ${y} C ${x + 70} ${y - 120}, ${x + 50} ${y - 260}, ${x + 165} ${y - 352}"
            fill="none" stroke="${shade(fc, -0.35)}" stroke-width="5"/>`;
  } else if (o.deco === 'flower') {
    const cx = w1 / 2 - 70;
    const cy = bandMidY;
    const pc = o.decoColor ?? '#f6a6c1';
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5;
      deco += `<circle cx="${cx + 30 * Math.cos(a)}" cy="${cy + 30 * Math.sin(a)}" r="28" fill="${pc}"/>`;
    }
    deco += `<circle cx="${cx}" cy="${cy}" r="20" fill="#f7d154"/>`;
  } else if (o.deco === 'buckle') {
    deco = `<rect x="-42" y="${-bandH - 8}" width="84" height="${bandH + 16}" rx="10"
              fill="none" stroke="${o.decoColor ?? '#f2c14e'}" stroke-width="12"/>`;
  } else if (o.deco === 'card') {
    // Mad-hatter style price card tucked in the band.
    deco = `<g transform="translate(${w1 / 2 - 100} ${-bandH - 70}) rotate(12)">
      <rect width="110" height="80" rx="6" fill="#fffaf0" stroke="#2b2235" stroke-width="4"/>
      <text x="55" y="52" font-family="Georgia, serif" font-size="34" text-anchor="middle" fill="#2b2235">4/all</text>
    </g>`;
  }

  return `
    <ellipse cx="0" cy="10" rx="${brimRx}" ry="${brimRy}" fill="${shade(color, -0.35)}"/>
    <ellipse cx="0" cy="0" rx="${brimRx}" ry="${brimRy}" fill="${color}"/>
    <ellipse cx="0" cy="-4" rx="${brimRx * 0.86}" ry="${brimRy * 0.7}" fill="${shade(color, 0.08)}"/>
    <path d="M ${-bw / 2} 0 L ${-tw / 2} ${-h} A ${tw / 2} ${ryt} 0 0 1 ${tw / 2} ${-h}
             L ${bw / 2} 0 A ${bw / 2} ${ryb} 0 0 1 ${-bw / 2} 0 Z" fill="${color}"/>
    <path d="M ${-bw / 2} 0 A ${bw / 2} ${ryb} 0 0 0 ${bw / 2} 0 L ${w1 / 2} ${-bandH}
             A ${w1 / 2} ${ry1} 0 0 1 ${-w1 / 2} ${-bandH} Z" fill="${band}"/>
    ${shine}
    <ellipse cx="0" cy="${-h}" rx="${tw / 2}" ry="${ryt}" fill="${shade(color, 0.18)}"/>
    ${deco}`;
}

// ---------- a little critter wearing the hat ----------
function critter(c) {
  const body = c.color;
  return `
    <ellipse cx="-110" cy="225" rx="60" ry="26" fill="${shade(body, -0.3)}"/>
    <ellipse cx="110" cy="225" rx="60" ry="26" fill="${shade(body, -0.3)}"/>
    <ellipse cx="0" cy="60" rx="270" ry="190" fill="${body}"/>
    <ellipse cx="-60" cy="0" rx="150" ry="70" fill="#fff" opacity="0.12"/>
    <ellipse cx="-80" cy="40" rx="42" ry="50" fill="#fff"/>
    <ellipse cx="80" cy="40" rx="42" ry="50" fill="#fff"/>
    <circle cx="${-72 + (c.look ?? 0)}" cy="50" r="22" fill="#2b2235"/>
    <circle cx="${88 + (c.look ?? 0)}" cy="50" r="22" fill="#2b2235"/>
    <circle cx="${-64 + (c.look ?? 0)}" cy="42" r="7" fill="#fff"/>
    <circle cx="${96 + (c.look ?? 0)}" cy="42" r="7" fill="#fff"/>
    <ellipse cx="-160" cy="120" rx="34" ry="18" fill="#f48fb1" opacity="0.6"/>
    <ellipse cx="160" cy="120" rx="34" ry="18" fill="#f48fb1" opacity="0.6"/>
    <path d="M -36 130 Q 0 162 36 130" fill="none" stroke="#2b2235" stroke-width="9" stroke-linecap="round"/>`;
}

function scene(spec, seed) {
  const r = rng(seed);
  const [bg1, bg2] = spec.bg;
  let confetti = '';
  const confettiColors = ['#ffffff', '#f2c14e', '#ef6f5e', '#8fd3c1', '#b39ddb'];
  for (let i = 0; i < 26; i++) {
    const x = r() * W;
    const y = r() * H * 0.62;
    const c = confettiColors[Math.floor(r() * confettiColors.length)];
    confetti +=
      spec.stars || r() < 0.25
        ? star(x, y, 10 + r() * 16, c, r() * Math.PI)
        : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(5 + r() * 9).toFixed(1)}" fill="${c}"/>`;
  }

  const groundY = 1000;
  const tilt = spec.tilt ?? 0;
  let subject;
  if (spec.critter) {
    const s = spec.hatScale ?? 0.55;
    subject = `
      <ellipse cx="800" cy="${groundY + 30}" rx="360" ry="40" fill="#000" opacity="0.12"/>
      <g transform="translate(800 ${groundY - 230})">${critter(spec.critter)}</g>
      <g transform="translate(800 ${groundY - 362}) rotate(${tilt}) scale(${s})">${hat(spec)}</g>`;
  } else {
    subject = `
      <ellipse cx="800" cy="${groundY + 20}" rx="${spec.brim * 0.62}" ry="46" fill="#000" opacity="0.14"/>
      <g transform="translate(800 ${groundY - 60}) rotate(${tilt})">${hat(spec)}</g>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/>
      </linearGradient>
      <radialGradient id="spot" cx="0.5" cy="0.45" r="0.55">
        <stop offset="0" stop-color="#fff" stop-opacity="0.35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#spot)"/>
    ${confetti}
    <ellipse cx="800" cy="${groundY + 260}" rx="1100" ry="300" fill="${shade(bg2, -0.12)}"/>
    ${subject}
  </svg>`;
}

// ---------- the collection ----------
const base = { crownBottom: 300, crownTop: 290, brim: 540 };
const HATS = [
  { slug: 'the-classic-silk', bg: ['#fbe9d0', '#f3cf9f'], color: '#2b2235', band: '#c0392b', height: 380 },
  { slug: 'midnight-plum', bg: ['#2c2350', '#4b3a7a'], color: '#6b3fa0', band: '#f2c14e', height: 400, stars: true },
  { slug: 'mustard-dandy', bg: ['#e8f4f1', '#b9e1d6'], color: '#e7a92f', band: '#6d4c41', height: 340, deco: 'feather', decoColor: '#ef6f5e', tilt: -6 },
  { slug: 'mint-julep', bg: ['#fff0f4', '#f8c9d6'], color: '#7cc8b4', band: '#f48fb1', height: 330, deco: 'flower', decoColor: '#ffffff' },
  { slug: 'ringmaster-red', bg: ['#fff6e0', '#f7d98b'], color: '#c0392b', band: '#2b2235', height: 470, deco: 'buckle' },
  { slug: 'the-wee-topper', bg: ['#e6f3ff', '#b8dcfb'], color: '#2b2235', band: '#8fd3c1', height: 360, critter: { color: '#7fb4e8', look: 6 }, tilt: 8 },
  { slug: 'velvet-teal', bg: ['#fde8df', '#f6b9a1'], color: '#1f6f78', band: '#ef6f5e', height: 360, deco: 'feather', decoColor: '#f2c14e', tilt: 5 },
  { slug: 'lavender-lark', bg: ['#fffbe8', '#f9e7a6'], color: '#b39ddb', band: '#6b3fa0', height: 330, critter: { color: '#f0a868', look: -8 }, tilt: -10, deco: 'flower', decoColor: '#ffffff' },
  { slug: 'sky-high', bg: ['#1d2b53', '#36508c'], color: '#7fb4e8', band: '#ffffff', height: 560, crownTop: 270, stars: true },
  { slug: 'tangerine-tipper', bg: ['#ecf5e6', '#c6e2b3'], color: '#f08a3c', band: '#2b2235', height: 350, tilt: -14 },
  { slug: 'hatters-special', bg: ['#f5ecff', '#d9c4f5'], color: '#5d4037', band: '#e7a92f', height: 420, deco: 'card', tilt: 6 },
  { slug: 'grandpas-sunday-best', bg: ['#eeeeee', '#cfcfcf'], color: '#546e7a', band: '#263238', height: 360, critter: { color: '#a1887f', look: 0 }, deco: 'feather', decoColor: '#90a4ae' },
].map((h) => ({ ...base, ...h }));

// Only some get sidecars — the rest show off the "optional" fallback.
const SIDECARS = {
  'the-classic-silk': `---
title: The Classic Silk
summary: Where it all began. Black silk, red band, impeccable posture.
order: 1
---
The hat that launched a thousand monocles. Our **Classic Silk** is cut from the finest
imaginary silk plush and finished with a band the colour of a well-aged claret.

Suitable for: weddings, funerals, bank heists (the polite kind), and Tuesdays.
`,
  'midnight-plum': `---
title: Midnight Plum
summary: For stargazers, night owls, and anyone who owns a cape.
---
Woven under a new moon, the **Midnight Plum** shimmers faintly when nobody is looking.
Its gold band is rumoured to be a repurposed comet tail.
`,
  'the-wee-topper': `---
title: The Wee Topper
summary: Proof that a top hat fits everyone. Everyone.
order: 2
---
Our smallest client insisted on a full fitting. The result: a perfectly proportioned topper
for a perfectly proportioned blob.

> "I have never felt so distinguished." — the blob
`,
  'ringmaster-red': `---
title: Ringmaster Red
summary: Ladies and gentlemen, children of all ages…
---
Tall, red, and impossible to ignore. Comes with a gold buckle and an irresistible urge
to announce things.
`,
  'hatters-special': `---
title: The Hatter's Special
summary: Price card included. Sanity sold separately.
---
A tribute to every hatter who has ever been called "a bit much". In this style, 4/all is
both the price and the philosophy.
`,
  'grandpas-sunday-best': `---
title: Grandpa's Sunday Best
summary: Dusted off once a week, worn with great ceremony.
---
Slate grey with a jaunty feather. Grandpa says it's "not a big deal". Grandpa has
polished it every Saturday night since 1974.
`,
};

await mkdir(OUT, { recursive: true });
let made = 0;
for (const [i, spec] of HATS.entries()) {
  const png = join(OUT, `${spec.slug}.png`);
  if (FORCE || !existsSync(png)) {
    await sharp(Buffer.from(scene(spec, 1000 + i * 77))).png({ compressionLevel: 9 }).toFile(png);
    made++;
  }
  const md = SIDECARS[spec.slug];
  const mdPath = join(OUT, `${spec.slug}.md`);
  if (md && (FORCE || !existsSync(mdPath))) await writeFile(mdPath, md);
}
console.log(`placeholders: ${made} image(s) written to gallery/`);
