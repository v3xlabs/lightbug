import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { sveltePreprocess } from 'svelte-preprocess';
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default defineConfig({
  plugins: [
    svelte({
      preprocess: sveltePreprocess({
        typescript: true,
      }),
    }),
    crx({
      manifest,
    }),
  ],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 5173,
    },
  },
});
