import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json';

export default defineConfig({
  plugins: [
    svelte(),
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

  // build: {
  //   rollupOptions: {
  //     input: {
  //       yeet: 'src/yeet.ts',
  //     },
  //     output: {
  //       entryFileNames: chunk => {
  //         console.log('chunk', chunk.name);
  //         return chunk.name === 'yeet' ? 'yeet.js' : '[name].js';
  //         // return chunk.name === 'background' ? 'background.js' : '[name].js';
  //         // return ['background', 'content'].includes(chunk.name) ? chunk.name + '.js' : '[name].js';
  //       }
  //     }
  //   },
  // },
});
