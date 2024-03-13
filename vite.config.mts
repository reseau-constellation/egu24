// Plugins
import Components from 'unplugin-vue-components/vite';
import Vue from '@vitejs/plugin-vue';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import ViteFonts from 'unplugin-fonts/vite';

// Utilities
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';


const dépendsÀExclure = ['chokidar', 'wrtc', '@libp2p/tcp', '@libp2p/mdns', 'env-paths'];


// https://vitejs.dev/config/
export default defineConfig({
  mode: process.env.MODE,
  base: '/egu24/',
  build: {
    target: 'esnext',
    rollupOptions: {
      external: dépendsÀExclure
    }
  },
  optimizeDeps: {
    exclude: dépendsÀExclure,
    esbuildOptions: {
      target: 'esnext',
    },
  },
  plugins: [
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify(),
    Components(),
    ViteFonts({
      google: {
        families: [
          {
            name: 'Roboto',
            styles: 'wght@100;300;400;500;700;900',
          },
        ],
      },
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  server: {
    port: 3000,
  },
});
