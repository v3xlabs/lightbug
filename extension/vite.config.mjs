import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import sveltePreprocess from 'svelte-preprocess';

export default defineConfig({
  plugins: [
    svelte({
      preprocess: sveltePreprocess({
        typescript: true,
      }),
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.'
        },
        {
          src: 'public/icons',
          dest: '.'
        }
      ]
    })
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'html/popup.html',
        options: 'html/options.html',
        background: 'src/background.ts',
        content: 'src/content.ts',
      },
      output: {
        entryFileNames: chunk => {
          // return chunk.name === 'background' ? 'background.js' : '[name].js';
          return ['background', 'content'].includes(chunk.name) ? chunk.name + '.js' : '[name].js';
        }
      }
    }
  }
});
