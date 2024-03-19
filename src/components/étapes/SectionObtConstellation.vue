<template>
  <etape-cours
    :n-etapes="nEtapes"
    :etape="etape"
    @retour="() => émettre('retour')"
    @avancer="() => émettre('avancer')"
  >
    <v-col class="text-h3 text-center" :cols="12"> Get Constellation </v-col>
    <v-col :cols="12" class="text-center">
      <v-btn class="ma-2" append-icon="mdi-download">{{
        t("Download (if on computer)")
      }}</v-btn>
      <v-btn class="ma-2" append-icon="mdi-open-in-new">{{
        t("Open browser app")
      }}</v-btn>
    </v-col>
    <v-col :cols="12" class="text-center">
      <span class="text-h6">
        {{ t("Here's a link to the documentation you can bookmark") }}</span
      >
      <br />
      <v-btn class="ma-6" append-icon="mdi-book-outline">{{ t("Docs") }}</v-btn>
      <br />
      <span class="text-h6">
        {{
          t(
            "And for the techies amongst you, here's the source code (all open source!)",
          )
        }}</span
      >
      <br />
      <v-btn class="ma-6" append-icon="mdi-xml">{{ t("Source code") }}</v-btn>
    </v-col>
  </etape-cours>
</template>
<script setup lang="ts">
import {
  கிளிமூக்கை_பயன்படுத்து,
  மொழிகளைப்_பயன்படுத்து,
} from "@lassi-js/kilimukku-vue";
import { useDisplay } from "vuetify";

import EtapeCours from "@/components/ÉtapeCours.vue";
import { computed } from "vue";

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
const { $மொ: t } = மொழியாக்கம்_பயன்படுத்து();
const {} = மொழியாக்கம்_பயன்படுத்து();

const lienAppli = computed(() => {
  return `https://appli.réseau-constellation.ca/#/?lg=${மொழி.value}`;
});
</script>
