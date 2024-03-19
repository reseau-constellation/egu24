<template>
  <etape-cours
    :n-etapes="nEtapes"
    :etape="etape"
    @retour="() => émettre('retour')"
    @avancer="() => émettre('avancer')"
  >
    <v-col :class="[mdAndUp ? 'text-h2' : 'text-h3', 'text-center']" :cols="12"> {{ t('obtConstellation.titre') }} </v-col>
    <v-col :cols="12">
      <div class="d-flex justify-center flex-wrap mb-6">
        <OptionObtConstellation
          v-if="lienTéléchargement"
          :titre="t('obtConstellation.options.télécharger')"
          icône="mdi-download-outline"
          :lien="lienTéléchargement"
          emphase
        />
        <OptionObtConstellation
          :titre="t('obtConstellation.options.navig')"
          icône="mdi-open-in-new"
          :lien="lienAppli"
          :emphase="!lienTéléchargement"
        />
        <OptionObtConstellation
          :titre="t('obtConstellation.options.docu')"
          icône="mdi-book-outline"
          :lien="lienDocu"
        />
        <OptionObtConstellation
          :titre="t('obtConstellation.options.codeSource')"
          icône="mdi-xml"
          :lien="URL_CODE_SOURCE"
        />
      </div>
    </v-col>
  </etape-cours>
</template>
<script setup lang="ts">
import {
  கிளிமூக்கை_பயன்படுத்து,
  மொழிகளைப்_பயன்படுத்து,
} from "@lassi-js/kilimukku-vue";

import EtapeCours from "@/components/ÉtapeCours.vue";
import { computed, onMounted, ref } from "vue";

import OptionObtConstellation from "./OptionObtConstellation.vue";
import { obtLienTéléchargement } from "@/utils/téléchargements";
import { useDisplay } from "vuetify";
import { URL_CODE_SOURCE } from "@/const";

defineProps<{
  nEtapes: number;
  etape: number;
}>();

const émettre = defineEmits<{
  (e: "retour"): void;
  (e: "avancer"): void;
}>();


const { மொழியாக்கம்_பயன்படுத்து } = கிளிமூக்கை_பயன்படுத்து();
const { $மொ: t } = மொழியாக்கம்_பயன்படுத்து();
const { மொழி } = மொழிகளைப்_பயன்படுத்து();
const { mdAndUp } = useDisplay();


const lienTéléchargement = ref<string>();
onMounted(async () => {
    lienTéléchargement.value = await obtLienTéléchargement();
})

const lienAppli = computed(() => {
  return `https://appli.réseau-constellation.ca/?lg=${மொழி.value}`;
});

const lienDocu = computed(() => {
  return `https://docu.réseau-constellation.ca/${மொழி.value}`;
});

</script>
