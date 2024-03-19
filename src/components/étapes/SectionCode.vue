<template>
  <etape-cours
    :n-etapes="nEtapes"
    :etape="etape"
    @retour="() => émettre('retour')"
    @avancer="() => émettre('avancer')"
  >
    <v-col>
      <span class="text-h3">Access Python/R/Julia code repos</span>
    </v-col>
  </etape-cours>
</template>
<script setup lang="ts">
import { கிளிமூக்கை_பயன்படுத்து } from "@lassi-js/kilimukku-vue";
import { useDisplay } from "vuetify";

import EtapeCours from "@/components/ÉtapeCours.vue";

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
