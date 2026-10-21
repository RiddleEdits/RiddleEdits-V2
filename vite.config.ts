import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { staticRoutes } from './src/data/routes';

const root = dirname(fileURLToPath(import.meta.url));

/**
 * Where the site lives. For https://<user>.github.io/RiddleEdits-V2/ this is "/RiddleEdits-V2/".
 * Using a custom domain (CNAME) on this repo? Set BASE_PATH=/ in the workflow.
 */
const base = process.env.BASE_PATH ?? '/RiddleEdits-V2/';

/**
 * GitHub Pages only serves files, so every page and every project gets its own index.html.
 * Direct links like /work/amd-vs-intel-gaming-pc/ then load without a redirect.
 */
function staticPages(): Plugin {
  return {
    name: 'static-pages',
    apply: 'build',
    closeBundle() {
      const dist = resolve(root, 'dist');
      const html = readFileSync(resolve(dist, 'index.html'), 'utf8');
      for (const route of staticRoutes()) {
        if (route === '/') continue;
        const file = resolve(dist, route.replace(/^\//, ''), 'index.html');
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, html);
      }
      writeFileSync(resolve(dist, '404.html'), html);
    },
  };
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), staticPages()],
  build: { chunkSizeWarningLimit: 1100 },
});
