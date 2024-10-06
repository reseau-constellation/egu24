<template>
  <etape-cours
    :n-etapes="nEtapes"
    :etape="etape"
    @retour="() => émettre('retour')"
    @avancer="() => émettre('avancer')"
  >
    <v-col :cols="mdAndUp ? 4 : 12" class="pa-6 my-auto">
      <v-img height="250" src="@/assets/logo.svg" />
    </v-col>
    <v-col
      :cols="mdAndUp ? 8 : 12"
      :class="{ 'my-auto': true, 'text-center': !mdAndUp, 'pt-0': true }"
    >
      <v-img
        :class="{ 'mx-4': !mdAndUp }"
        :src="logoCours"
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
        <v-select 
          v-model="choixCours" :items="cours.map(c=>c.nom)"
          variant="plain"
        >
          <template #selection="{item}">
            <span
            :class="{
              'text-h4': mdAndUp,
              'text-h5': !mdAndUp,
              'font-weight-light': true,
            }"
            >
            {{ t(`accueil.titre.${item.value}`) }}
            </span>
          </template>
        </v-select>
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
import { ref } from "vue";
import { watchEffect } from "vue";

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

// Sélection du cours
type InfoCours = {
  nom: string;
  logo: Promise<typeof import("*.png") | typeof import("*.svg")>;
}
const cours: InfoCours[] = [
  {
    nom: "nsih24",
    logo: import("@/assets/logo nsih 2024.png")
  },
  {
    nom: "egu24",
    logo: import("@/assets/logo cours egu24.png")
  }
  
]

const choixCours = ref<string>(cours[0].nom);
const logoCours = ref<string>();
watchEffect(async () => {
  logoCours.value = (await cours.find(c=>c.nom === choixCours.value)?.logo)?.default
})


</script>
