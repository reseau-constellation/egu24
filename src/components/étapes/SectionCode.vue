<template>
  <etape-cours
    :n-etapes="nEtapes"
    :etape="etape"
    @retour="() => émettre('retour')"
    @avancer="() => émettre('avancer')"
  >
    <v-col :class="[mdAndUp ? 'text-h2' : 'text-h3', 'text-center']" :cols="12">
      {{ t("code.titre") }}
    </v-col>
    <v-col :cols="12">
      <div class="d-flex justify-center flex-wrap mb-6">
        <CarteLien
          :titre="t('code.options.appli')"
          icône="mdi-link"
          :lien="lienAppli"
          emphase
        />
        <CarteLien
          v-if="false"
          :titre="t('code.options.python')"
          icône="mdi-language-python"
          :lien="lienPython"
        />
        <CarteLien
          v-if="false"
          :titre="t('code.options.r')"
          icône="mdi-language-r"
          :lien="lienR"
        />
        <CarteLien
          v-if="false"
          :titre="t('code.options.julia')"
          icône="mdi-alpha-j-box-outline"
          :lien="lienJulia"
        />
      </div>
    </v-col>
    <v-col :cols="12" class="text-center text-h6">
      {{ t("code.conclusion") }}
      <br />
      <v-icon
        icon="mdi-email-outline"
        start
        @click="() => ouvrirLien(`mailto://${COURRIEL_CONTACT}`)"
      />
      {{ COURRIEL_CONTACT }}
    </v-col>
  </etape-cours>
</template>
<script setup lang="ts">
import { கிளிமூக்கை_பயன்படுத்து } from "@lassi-js/kilimukku-vue";
import { useDisplay } from "vuetify";

import EtapeCours from "@/components/ÉtapeCours.vue";
import CarteLien from "./communs/CarteLien.vue";
import { COURRIEL_CONTACT, ID_NUÉE_DONNÉES } from "@/const";
import { ouvrirLien } from "@/utils/utils";

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

const lienAppli = `https://appli.réseau-constellation.ca/#/données/nuée/${encodeURIComponent(ID_NUÉE_DONNÉES)}`;
const lienPython = "https://github.com/reseau-constellation/egu24-python";
const lienR = "https://github.com/reseau-constellation/egu24-r";
const lienJulia = "https://github.com/reseau-constellation/egu24-julia";
</script>
