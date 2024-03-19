import Components from "unplugin-vue-components/vite";
import ViteFonts from "unplugin-fonts/vite";

import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { join } from "node:path";

import rollupNodePolyFill from "rollup-plugin-polyfill-node";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import builtins from "rollup-plugin-node-builtins";

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = PACKAGE_ROOT;

const générerExtentions = () => {
  const extentions = [
    vue({ template: { transformAssetUrls } }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
    Components(),
    ViteFonts({
      google: {
        families: [
          {
            name: "Roboto",
            styles: "wght@100;300;400;500;700;900",
          },
        ],
      },
    }),

    NodeGlobalsPolyfillPlugin({
      buffer: true,
      process: true,
    }),
    {
      name: "vite:global-polyfill",
      transformIndexHtml: {
        handler(html) {
          return {
            html,
            tags: [
              {
                tag: "script",
                children: `
                function getGlobal() {
                  if (typeof globalThis === 'object') return globalThis;
                  if (typeof window === 'object') return window;
                }
                global = getGlobal()
              `,
                injectTo: "head-prepend",
              },
            ],
          };
        },
      },
    },
    builtins({
      fs: true,
    }),
  ];
  return extentions;
};

const générerAliasRésolution = () => {
  const commun = {
    "@/": join(PACKAGE_ROOT, "src") + "/",
  };
  return Object.assign({}, commun, {
    assert: "rollup-plugin-node-polyfills/polyfills/assert",
    crypto: "crypto-browserify",
    path: "rollup-plugin-node-polyfills/polyfills/path",
    "./buffer-globalThis": "crypto-browserify",
    stream: "rollup-plugin-node-polyfills/polyfills/stream",
    os: "rollup-plugin-node-polyfills/polyfills/os",
    process: "rollup-plugin-node-polyfills/polyfills/process-es6",
    util: "util",
  });
};

// Pareil pour Électron ou non, parce qu'ici il s'agit de la partie interface (rendu)
const dépendsÀExclure = ["chokidar", "wrtc", "env-paths"];

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  resolve: {
    alias: générerAliasRésolution(),
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  base: "/egu24/", // pourÉlectron ? '' : '/iug/', // Plus nécessaire maintenant qu'on est sur appli.réseau-constellation.ca/
  server: {
    port: 3000,
    fs: {
      strict: true,
    },
  },
  build: {
    target: "esnext",
    rollupOptions: {
      input: join(PACKAGE_ROOT, "index.html"),
      external: dépendsÀExclure,
      plugins: [rollupNodePolyFill()],
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  optimizeDeps: {
    exclude: dépendsÀExclure,
    esbuildOptions: {
      target: "esnext",
    },
  },
  test: {
    environment: "happy-dom",
    server: {
      deps: {
        inline: ["vuetify"],
      },
    },
    coverage: {
      provider: "istanbul",
    },
  },
  plugins: générerExtentions(),
};

export default config;
