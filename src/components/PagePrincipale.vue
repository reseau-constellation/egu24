<template>
  <v-window v-model="page" direction="vertical" style="height: 100%" disabled>
    <SectionAccueil
      :n-etapes="nÉtapes"
      :etape="0"
      @retour="page--"
      @avancer="page++"
    />
    <SectionDémo
      :n-etapes="nÉtapes"
      :etape="1"
      @retour="page--"
      @avancer="page++"
    />
    <SectionObtConstellation
      :n-etapes="nÉtapes"
      :etape="2"
      @retour="page--"
      @avancer="page++"
    />
    <SectionTelechargerDonnees
      :n-etapes="nÉtapes"
      :etape="3"
      @retour="page--"
      @avancer="page++"
    />
    <SectionCode
      :n-etapes="nÉtapes"
      :etape="4"
      @retour="page--"
      @avancer="page++"
    />
  </v-window>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import SectionAccueil from "./étapes/SectionAccueil.vue";

import { obtLienTéléchargement } from "@/utils/téléchargements";
import SectionObtConstellation from "./étapes/obtConstellation/SectionObtConstellation.vue";
import SectionTelechargerDonnees from "./étapes/SectionTéléchargerDonnées.vue";
import SectionDémo from "./étapes/démo/SectionDémo.vue";
import SectionCode from "./étapes/SectionCode.vue";

const page = ref(0);
const nÉtapes = 5;

const lienTéléchargementDirecte = ref<string>();
onMounted(async () => {
  lienTéléchargementDirecte.value = await obtLienTéléchargement();
});
</script>
