<template>
  <v-card width="300">
    <v-img
      :src="image"
      class="ma-4"
      contain
      max-height="150"
    ></v-img>
    <v-card-item class="text-center">
      <v-card-title>
        {{ t(`téléchargements.soAvecExt.${se}`, { ext }) }}
      </v-card-title>
      <v-card-subtitle>
        {{ t('téléchargements.version', { v: versionFormattée }) }}
      </v-card-subtitle>
    </v-card-item>
    <v-card-text class="my-2 text-center">
      <v-btn
        prepend-icon="mdi-download"
        @click="ouvrirLien(url)"
      >
        {{ t('téléchargements.télécharger') }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';

import {
  // எண்களைப்_பயன்படுத்து,
  கிளிமூக்கை_பயன்படுத்து,
} from '@lassi-js/kilimukku-vue';

import { InfoTéléchargement } from '@/utils/téléchargements';
import { ouvrirLien } from '@/utils/utils';

const props = defineProps<InfoTéléchargement>();

const { மொழியாக்கம்_பயன்படுத்து } = கிளிமூக்கை_பயன்படுத்து();
const { $மொ: t } = மொழியாக்கம்_பயன்படுத்து({});
// const {பதிப்பை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();

// Version
const versionFormattée = computed(() => props.version.toString().replace(/^v/, '')); // பதிப்பை_வடிவூட்டு(props.version);

// Image
const images = {
  linux: import('@/assets/logosSO/Linux.png'),
  mac: import('@/assets/logosSO/macOS.png'),
  windows: import('@/assets/logosSO/Windows.png'),
  source: import('@/assets/undraw/undraw_proud_coder_re_exuy.svg'),
};

const image = ref<string>();
onMounted(async () => {
  image.value = (await images[props.se]).default;
});
const ext = computed(() => {
  const composantes = props.url.split('.');
  return '.' + composantes[composantes.length - 1];
});
</script>
