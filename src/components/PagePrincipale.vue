<template>
    <v-window v-model="page" direction="vertical" style="height: 100%" disabled>
      <SectionAccueil :n-etapes="nÉtapes" :etape="0" @retour="page--" @avancer="page++" />
      <SectionObtConstellation :n-etapes="nÉtapes" :etape="1" @retour="page--" @avancer="page++" />
      <SectionTelechargerDonnees :n-etapes="nÉtapes" :etape="2" @retour="page--" @avancer="page++" />
      <SectionDémo :n-etapes="nÉtapes" :etape="3" @retour="page--" @avancer="page++"/>
      <SectionCode :n-etapes="nÉtapes" :etape="4" @retour="page--" @avancer="page++"/>
    </v-window>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useDisplay } from 'vuetify';

import { கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து } from '@lassi-js/kilimukku-vue';

import SectionAccueil from './étapes/SectionAccueil.vue';
import EtapeCours from './ÉtapeCours.vue';

import { obtLienTéléchargement } from '@/utils/téléchargements';
import SectionObtConstellation from './étapes/SectionObtConstellation.vue';
import SectionTelechargerDonnees from './étapes/SectionTéléchargerDonnées.vue';
import SectionDémo from './étapes/SectionDémo.vue';
import SectionCode from './étapes/SectionCode.vue';

const { mdAndUp } = useDisplay();

const { மொழியாக்கம்_பயன்படுத்து } = கிளிமூக்கை_பயன்படுத்து();
const { $மொ: t } = மொழியாக்கம்_பயன்படுத்து({});
const { மொழி } = மொழிகளைப்_பயன்படுத்து();

const page = ref(0);
const nÉtapes = 5;

const lienAppli = computed(() => {
  return `https://appli.réseau-constellation.ca/#/?lg=${மொழி.value}`;
});

const lienTéléchargementDirecte = ref<string>();
onMounted(async () => {
  lienTéléchargementDirecte.value = await obtLienTéléchargement();
});
</script>
