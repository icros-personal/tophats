import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { site } from './src/site.ts';

// Pages are pre-rendered to static HTML after the build by scripts/prerender.mjs
// (see the "build" script in package.json).
export default defineConfig(({ isSsrBuild }) => ({
  base: site.basePath,
  plugins: [react()],
  build: {
    // The SSR bundle is only used at build time; it doesn't need public/ copied.
    copyPublicDir: !isSsrBuild,
  },
}));
