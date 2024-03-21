import Components from "unplugin-vue-components/vite";
import ViteFonts from "unplugin-fonts/vite";

import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { join } from "node:path";

import rollupNodePolyFill from "rollup-plugin-polyfill-node";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import builtins from "rollup-plugin-node-builtins";
import axios from "axios";
import { createWriteStream, existsSync, writeFileSync } from "node:fs";
import { promisify } from "node:util";
import stream from "stream";

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

/*
const urls = [
  {id: "63f33000-3c5b-4ae1-a471-ff320fdd8379", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A63f33000-3c5b-4ae1-a471-ff320fdd8379%5D%2Fprecip_image"},
{id: "b61c5c12-80a0-4792-b2dd-863df41e0036", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Ab61c5c12-80a0-4792-b2dd-863df41e0036%5D%2Fprecip_image"},
{id: "b3cc1b86-e461-4799-adf8-5fbc773ef259", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Ab3cc1b86-e461-4799-adf8-5fbc773ef259%5D%2Fprecip_image"},
{id: "0fd998f2-1d93-4977-8dfa-8d5e06c5ac66", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A0fd998f2-1d93-4977-8dfa-8d5e06c5ac66%5D%2Fprecip_image"},
{id: "111bb611-4d13-4078-8efe-3dd3ec188023", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A111bb611-4d13-4078-8efe-3dd3ec188023%5D%2Fprecip_image"},
{id: "57c27ead-0c8d-430d-bab5-937f4e752655", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A57c27ead-0c8d-430d-bab5-937f4e752655%5D%2Fprecip_image"},
{id: "354d9aec-847d-4aad-8b03-8b873717295f", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A354d9aec-847d-4aad-8b03-8b873717295f%5D%2Fprecip_image"},
{id: "54e41355-abe3-4d60-aaae-da2855fbdee9", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A54e41355-abe3-4d60-aaae-da2855fbdee9%5D%2Fprecip_image"},
{id: "3ef4a7d4-b671-4afc-b2b8-edf18985829e", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A3ef4a7d4-b671-4afc-b2b8-edf18985829e%5D%2Fprecip_image"},
{id: "fde62246-d40e-49db-830d-5a42a142d676", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Afde62246-d40e-49db-830d-5a42a142d676%5D%2Fprecip_image"},
{id: "7b595502-ea47-451c-a2eb-b8ae000dc38c", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A7b595502-ea47-451c-a2eb-b8ae000dc38c%5D%2Fprecip_image"},
{id: "0b875fbb-aab2-46d4-afb5-f2bf8243ab0a", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A0b875fbb-aab2-46d4-afb5-f2bf8243ab0a%5D%2Fprecip_image"},
{id: "a6e13eca-69cf-4cae-87ba-1a41d3f4aaad", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Aa6e13eca-69cf-4cae-87ba-1a41d3f4aaad%5D%2Fprecip_image"},
{id: "d48778ee-a7bf-4286-84b3-0a47465fc207", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Ad48778ee-a7bf-4286-84b3-0a47465fc207%5D%2Fprecip_image"},
{id: "daa497ed-32fe-4a2e-9988-6f90edc1f25f", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Adaa497ed-32fe-4a2e-9988-6f90edc1f25f%5D%2Fprecip_image"},
{id: "739bdc0b-4ba4-4c80-949e-bf07ceb163ee", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A739bdc0b-4ba4-4c80-949e-bf07ceb163ee%5D%2Fprecip_image"},
{id: "efbf26dc-2984-4406-b6f9-3aba222a66c5", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Aefbf26dc-2984-4406-b6f9-3aba222a66c5%5D%2Fprecip_image"},
{id: "8af31206-b660-455f-a5db-4bfc5f47f06c", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A8af31206-b660-455f-a5db-4bfc5f47f06c%5D%2Fprecip_image"},
{id: "968020db-99f6-40ca-a012-0e37a81e40f7", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A968020db-99f6-40ca-a012-0e37a81e40f7%5D%2Fprecip_image"},
{id: "c85aa99b-0e7e-4f70-977a-3c7680794163", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Ac85aa99b-0e7e-4f70-977a-3c7680794163%5D%2Fprecip_image"},
{id: "91d677dd-e6a6-4ca8-9b4a-89c4ddcb0fa3", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A91d677dd-e6a6-4ca8-9b4a-89c4ddcb0fa3%5D%2Fprecip_image"},
{id: "56dd4540-7883-4301-a017-45ac5bac5d92", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A56dd4540-7883-4301-a017-45ac5bac5d92%5D%2Fprecip_image"},
{id: "b6d1e1c1-3f34-42a5-bdac-d1e394ebe462", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Ab6d1e1c1-3f34-42a5-bdac-d1e394ebe462%5D%2Fprecip_image"},
{id: "962d99b0-255f-4ba6-994c-521f62cc2f8e", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A962d99b0-255f-4ba6-994c-521f62cc2f8e%5D%2Fprecip_image"},
{id: "cb0b9898-f7fc-49bb-8e99-e8111e0e7f98", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Acb0b9898-f7fc-49bb-8e99-e8111e0e7f98%5D%2Fprecip_image"},
{id: "0eaefd63-e4da-43c0-8b15-3c8400f84021", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A0eaefd63-e4da-43c0-8b15-3c8400f84021%5D%2Fprecip_image"},
{id: "4d13176e-272a-4403-913a-785ee36b387a", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A4d13176e-272a-4403-913a-785ee36b387a%5D%2Fprecip_image"},
{id: "2965b248-c52d-415b-a1e1-c93c200a195e", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A2965b248-c52d-415b-a1e1-c93c200a195e%5D%2Fprecip_image"},
{id: "7caaf070-680a-47b2-a679-fd315dd39ab9", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A7caaf070-680a-47b2-a679-fd315dd39ab9%5D%2Fprecip_image"},
{id: "1334158a-98be-49c2-ae2d-4099b4c4f12b", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A1334158a-98be-49c2-ae2d-4099b4c4f12b%5D%2Fprecip_image"},
{id: "234aba17-250f-412d-b372-c8877b2e4d93", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A234aba17-250f-412d-b372-c8877b2e4d93%5D%2Fprecip_image"},
{id: "62674979-73f7-4e62-acc3-195a1a685b89", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A62674979-73f7-4e62-acc3-195a1a685b89%5D%2Fprecip_image"},
{id: "359a050f-82a0-4159-aeb5-07af06413d39", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A359a050f-82a0-4159-aeb5-07af06413d39%5D%2Fprecip_image"},
{id: "46687e4b-6f65-4236-a42e-e05388a21245", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A46687e4b-6f65-4236-a42e-e05388a21245%5D%2Fprecip_image"},
{id: "c8094918-7c33-4268-bd8e-f9db8ca1186c", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Ac8094918-7c33-4268-bd8e-f9db8ca1186c%5D%2Fprecip_image"},
{id: "33164c8d-8d53-4704-b7c7-9b3205f52d7e", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A33164c8d-8d53-4704-b7c7-9b3205f52d7e%5D%2Fprecip_image"},
{id: "e0e52c25-a3ba-451e-b2bf-c2602b9a8558", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Ae0e52c25-a3ba-451e-b2bf-c2602b9a8558%5D%2Fprecip_image"},
{id: "7456682e-e694-439a-9147-9c51e6c1442d", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A7456682e-e694-439a-9147-9c51e6c1442d%5D%2Fprecip_image"},
{id: "2ec972f1-b00c-4545-9a6f-ef193f019d22", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A2ec972f1-b00c-4545-9a6f-ef193f019d22%5D%2Fprecip_image"},
{id: "e5841584-b3c2-46ff-ab2c-bf3be04099f7", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Ae5841584-b3c2-46ff-ab2c-bf3be04099f7%5D%2Fprecip_image"},
{id: "afbeb567-60af-4883-9e08-3d6a3c8e4e23", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Aafbeb567-60af-4883-9e08-3d6a3c8e4e23%5D%2Fprecip_image"},
{id: "1781e449-1a2c-4bd0-bcf8-f30b240a64a5", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A1781e449-1a2c-4bd0-bcf8-f30b240a64a5%5D%2Fprecip_image"},
{id: "7278d014-23b0-46a7-ad3d-ef0593752139", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A7278d014-23b0-46a7-ad3d-ef0593752139%5D%2Fprecip_image"},
{id: "53b04bef-82e8-491c-8205-d396a1c1b2f7", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A53b04bef-82e8-491c-8205-d396a1c1b2f7%5D%2Fprecip_image"},
{id: "aa31f1a6-157f-4835-88e4-b656d4670106", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Aaa31f1a6-157f-4835-88e4-b656d4670106%5D%2Fprecip_image"},
{id: "a58abe66-2b57-46d0-a3df-aa6fc2796c49", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Aa58abe66-2b57-46d0-a3df-aa6fc2796c49%5D%2Fprecip_image"},
{id: "670c1827-eb27-4aa9-8ae6-e2a2d06d364d", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A670c1827-eb27-4aa9-8ae6-e2a2d06d364d%5D%2Fprecip_image"},
{id: "53b80ef5-45c9-4865-9490-4081bb527718", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A53b80ef5-45c9-4865-9490-4081bb527718%5D%2Fprecip_image"},
{id: "7c47d6ab-d169-4d5c-826a-b927fd9bdc88", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A7c47d6ab-d169-4d5c-826a-b927fd9bdc88%5D%2Fprecip_image"},
{id: "33ae48c3-c504-4293-bf59-f149e735a032", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A33ae48c3-c504-4293-bf59-f149e735a032%5D%2Fprecip_image"},
{id: "1c6502f8-f6e6-4edc-a10e-11b7e1446fd4", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A1c6502f8-f6e6-4edc-a10e-11b7e1446fd4%5D%2Fprecip_image"},
{id: "adaadb10-0680-40fc-a536-757d53b4783c", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Aadaadb10-0680-40fc-a536-757d53b4783c%5D%2Fprecip_image"},
{id: "3fb4d462-505b-423f-b233-9fe2fbf2ab7d", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A3fb4d462-505b-423f-b233-9fe2fbf2ab7d%5D%2Fprecip_image"},
{id: "e81a2f8b-4b7e-41b3-aeac-da5795221688", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Ae81a2f8b-4b7e-41b3-aeac-da5795221688%5D%2Fprecip_image"},
{id: "945a5da9-d77b-4883-83d0-aa719fada1a3", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A945a5da9-d77b-4883-83d0-aa719fada1a3%5D%2Fprecip_image"},
{id: "668dd4b0-2301-4f97-a61c-c1fc072bd467", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A668dd4b0-2301-4f97-a61c-c1fc072bd467%5D%2Fprecip_image"},
{id: "2e0f097d-aacd-4fc4-8877-f702b8038288", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A2e0f097d-aacd-4fc4-8877-f702b8038288%5D%2Fprecip_image"},
{id: "1bd59cef-8b8c-4597-9fcd-a8f9145452dc", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A1bd59cef-8b8c-4597-9fcd-a8f9145452dc%5D%2Fprecip_image"},
{id: "0484b83e-287d-4795-870f-214a9394e13f", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A0484b83e-287d-4795-870f-214a9394e13f%5D%2Fprecip_image"},
{id: "fd05667b-8d79-427a-b777-8c354ae9d3b5", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Afd05667b-8d79-427a-b777-8c354ae9d3b5%5D%2Fprecip_image"},
{id: "73eb1d12-b4f7-4495-b523-03a30391fa0f", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A73eb1d12-b4f7-4495-b523-03a30391fa0f%5D%2Fprecip_image"},
{id: "12fc964f-f3b5-4ece-b649-638cb8c4e40a", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A12fc964f-f3b5-4ece-b649-638cb8c4e40a%5D%2Fprecip_image"},
{id: "77dcba10-d9ff-4f1e-9243-a84e4ef6ec1f", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A77dcba10-d9ff-4f1e-9243-a84e4ef6ec1f%5D%2Fprecip_image"},
{id: "db692e2b-d526-4c66-9121-31fd2c84b2b5", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Adb692e2b-d526-4c66-9121-31fd2c84b2b5%5D%2Fprecip_image"},
{id: "5e0f59ac-0f24-4255-afc3-a8a731adf9bf", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A5e0f59ac-0f24-4255-afc3-a8a731adf9bf%5D%2Fprecip_image"},
{id: "5e4d704e-f9b0-4f13-9b67-03d20880c93c", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A5e4d704e-f9b0-4f13-9b67-03d20880c93c%5D%2Fprecip_image"},
{id: "af7ca033-330c-4743-bd33-96a632dc9bcb", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Aaf7ca033-330c-4743-bd33-96a632dc9bcb%5D%2Fprecip_image"},
{id: "cbe13669-c709-48ab-9a7b-88c144ffc159", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Acbe13669-c709-48ab-9a7b-88c144ffc159%5D%2Fprecip_image"},
{id: "2cd87ee2-dba0-43d4-8d05-573933dd0dfd", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A2cd87ee2-dba0-43d4-8d05-573933dd0dfd%5D%2Fprecip_image"},
{id: "6cd3c7fd-2785-429a-a0c0-38933de143ba", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A6cd3c7fd-2785-429a-a0c0-38933de143ba%5D%2Fprecip_image"},
{id: "bf084015-1c47-4666-b5cb-8ebf3d5336a6", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Abf084015-1c47-4666-b5cb-8ebf3d5336a6%5D%2Fprecip_image"},
{id: "95bc7992-6a98-4948-9bbe-50255cc6421b", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A95bc7992-6a98-4948-9bbe-50255cc6421b%5D%2Fprecip_image"},
{id: "264d90d6-5386-42a9-a02c-7f74c1f5a158", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A264d90d6-5386-42a9-a02c-7f74c1f5a158%5D%2Fprecip_image"},
{id: "98cab885-01af-4ed7-b809-43554204ad8e", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A98cab885-01af-4ed7-b809-43554204ad8e%5D%2Fprecip_image"},
{id: "ca767251-3b63-4c11-ba48-06f3c28e641d", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Aca767251-3b63-4c11-ba48-06f3c28e641d%5D%2Fprecip_image"},
{id: "4dc830d7-ed49-4297-b585-ee040e69987c", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A4dc830d7-ed49-4297-b585-ee040e69987c%5D%2Fprecip_image"},
{id: "8f1a194b-4858-4379-99b8-aee921cb9857", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A8f1a194b-4858-4379-99b8-aee921cb9857%5D%2Fprecip_image"},
{id: "125dced1-9367-4f36-9380-cc971a2e6765", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A125dced1-9367-4f36-9380-cc971a2e6765%5D%2Fprecip_image"},
{id: "6a64c7fa-ab8f-4432-8bd5-bb1ffddfd211", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A6a64c7fa-ab8f-4432-8bd5-bb1ffddfd211%5D%2Fprecip_image"},
{id: "8b51cf44-9062-4a12-998a-60efd8d4ea63", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A8b51cf44-9062-4a12-998a-60efd8d4ea63%5D%2Fprecip_image"},
{id: "d9f0d0d0-82aa-4bd1-91f5-6db508dab992", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Ad9f0d0d0-82aa-4bd1-91f5-6db508dab992%5D%2Fprecip_image"},
{id: "acd44583-6881-4a41-afc0-ebcbebf961f4", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Aacd44583-6881-4a41-afc0-ebcbebf961f4%5D%2Fprecip_image"},
{id: "d2b938eb-d695-4e14-9ee2-dde1cea47e82", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Ad2b938eb-d695-4e14-9ee2-dde1cea47e82%5D%2Fprecip_image"},
{id: "918d2d6f-dc5a-4d1b-9dd5-2de96cc56ac6", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A918d2d6f-dc5a-4d1b-9dd5-2de96cc56ac6%5D%2Fprecip_image"},
{id: "1f756bda-953a-4051-be5b-a71bc2396d32", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A1f756bda-953a-4051-be5b-a71bc2396d32%5D%2Fprecip_image"},
{id: "c3ee6e26-d5a6-428d-94df-6f6434c2ac26", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Ac3ee6e26-d5a6-428d-94df-6f6434c2ac26%5D%2Fprecip_image"},
{id: "9948d540-759c-43af-8564-9cc3eac65542", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3A9948d540-759c-43af-8564-9cc3eac65542%5D%2Fprecip_image"},
{id: "c6656497-915d-47e8-a3c1-527dd62e5c66", url: "http://nepal.smartphones4water.org/view/binaryData?blobKey=s4w_nepal_v1.6%5B%40version%3Dnull+and+%40uiVersion%3Dnull%5D%2Fdata%5B%40key%3Duuid%3Ac6656497-915d-47e8-a3c1-527dd62e5c66%5D%2Fprecip_image"},

]
const finished = promisify(stream.finished);
await Promise.all(urls.map(async u=>{
  const fichier = `./src/données/images/${u.id}.jpg`
  if (existsSync(fichier)) return;
  const writer = createWriteStream(fichier);
  const response = await axios({url: u.url, responseType: 'stream'});
  response.data.pipe(writer);
  finished(writer)
}))
*/
