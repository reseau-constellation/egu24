<template>
  <etape-cours
    :n-etapes="nEtapes"
    :etape="etape"
    @retour="() => émettre('retour')"
    @avancer="() => émettre('avancer')"
  >
    <v-col :cols="mdAndUp ? 4 : 12" class="pa-6 my-auto">
      <v-img height="300" src="@/assets/logo.svg" />
    </v-col>
    <v-col
      :cols="mdAndUp ? 8 : 12"
      :class="{ 'my-auto': true, 'text-center': !mdAndUp }"
    >
      <v-img
        :class="{ 'mb-4': true, 'mx-4': !mdAndUp }"
        src="@/assets/logo egu.svg"
        height="150"
        :width="mdAndUp ? 600 : undefined"
      />
      <div
        :class="{
          'text-h4': mdAndUp,
          'text-h5': !mdAndUp,
          'font-weight-light': true,
          'mb-n1': true,
          'mx-4': !mdAndUp,
        }"
      >
        {{ t("accueil.titre") }}
      </div>
      <v-btn prepend-icon="mdi-earth" class="my-6">
        {{ t("accueil.changerLangue") }}
        <menu-langues />
      </v-btn>
    </v-col>
  </etape-cours>
</template>
<script setup lang="ts">
import { கிளிமூக்கை_பயன்படுத்து } from "@lassi-js/kilimukku-vue";
import { useDisplay } from "vuetify";

import EtapeCours from "@/components/ÉtapeCours.vue";
import MenuLangues from "@/components/MenuLangues.vue";

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
