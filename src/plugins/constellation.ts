import type { App } from "vue";

import { mandataire } from "@constl/ipa";

export default {
  install: (app: App) => {
    const client = mandataire.générerMandataireProc();
    app.config.globalProperties.$constl = client;
    app.provide("constl", client);
  },
};
