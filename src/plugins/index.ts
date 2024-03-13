/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify';
import routeur from './routeur';
import constellation from './constellation';
import kilimukku from './kilimukku';

// Types
import type { App } from 'vue';

export function registerPlugins(app: App) {
  app.use(vuetify);
  app.use(routeur);
  app.use(constellation);
  app.use(kilimukku);
}
