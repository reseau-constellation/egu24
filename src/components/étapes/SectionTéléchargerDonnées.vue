<template>
  <etape-cours
    :n-etapes="nEtapes"
    :etape="etape"
    @retour="() => émettre('retour')"
    @avancer="() => émettre('avancer')"
  >
    <v-col :class="[mdAndUp ? 'text-h2' : 'text-h3', 'text-center']" :cols="12"> {{ t('données.titre') }} </v-col>
    <v-col :cols="12">
      <div class="d-flex justify-center flex-wrap mb-6">
        <CarteOption
          :titre="t('données.télécharger')"
          :lien="URL_DONNÉES_EXEMPLE"
          icône="mdi-download-outline" 
          emphase
        />
        <CarteOption
          :titre="t('données.lienDynamique')"
          :lien="URL_DONNÉES_LIEN"
          icône="mdi-link" 
        />
      </div>
    </v-col>
    <v-col :cols="12" class="text-center">
      <span class="text-disabled"> {{ t('données.crédits') }} https://climate.meteo.gc.ca</span>
    </v-col>
  </etape-cours>
</template>
<script setup lang="ts">
import { கிளிமூக்கை_பயன்படுத்து } from "@lassi-js/kilimukku-vue";
import { useDisplay } from "vuetify";

import EtapeCours from "@/components/ÉtapeCours.vue";
import { URL_DONNÉES_EXEMPLE, URL_DONNÉES_LIEN } from "@/const";
import { ouvrirLien } from "@/utils/utils";
import CarteOption from "./communs/CarteLien.vue";

defineProps<{
  nEtapes: number;
  etape: number;
}>();
const émettre = defineEmits<{
  (e: "retour"): void;
  (e: "avancer"): void;
}>();

const { mdAndUp } = useDisplay();

const { மொழியாக்கம்_பயன்படுத்து } = கிளிமூக்கை_பயன்படுத்து();
const { $மொ: t } = மொழியாக்கம்_பயன்படுத்து({});
</script>
