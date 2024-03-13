import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import PagePrincipale from '@/components/PagePrincipale.vue';
import { மொழிகளைப்_பயன்படுத்து } from '@lassi-js/kilimukku-vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: PagePrincipale,
  }
];

const routeur = createRouter({
  history: createWebHashHistory(),
  routes,
});

routeur.afterEach(to => {
  const { lg } = to.query;
  if (lg && typeof lg === 'string') {
    const { மொழிகளை_தேர்ந்தெடுக்கொள்ளு } = மொழிகளைப்_பயன்படுத்து();
    மொழிகளை_தேர்ந்தெடுக்கொள்ளு(lg);
  }
});

export default routeur;
