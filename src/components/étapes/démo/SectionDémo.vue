<template>
  <etape-cours
    :n-etapes="nEtapes"
    :etape="etape"
    @retour="() => émettre('retour')"
    @avancer="() => émettre('avancer')"
  >
    <v-col :cols="12">
      <v-card class="px-6" variant="flat">
        <div class="text-h3">{{ t("démo.titre") }}</div>
        <v-menu v-if="!mdAndUp">
          <template #activator="{props: propsActivateur}">
            <v-btn v-bind="propsActivateur" icon="mdi-cog" variant="flat"></v-btn>
          </template>
          <v-list>
            <v-list-item v-if="!mdAndUp" prepend-icon="mdi-download" :title="t('démo.indiceTélécharger')" @click="() => téléchargerDonnées()" />
            <v-list-item class="text-error" :title="t('démo.effacerDonnées')" @click="()=>effacerDonnées()">
              <template #prepend>
                <v-icon icon="mdi-delete" />
              </template>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card>
      <v-divider class="my-4" />
    </v-col>
    <v-col v-if="mdAndUp" :cols="mdAndUp ? 6 : 12">
      <v-card
        class="px-6"
        variant="flat"
        height="65vh"
        style="overflow-y: scroll"
      >
        <div class="text-h5 d-flex">
          {{ t("démo.sousTitre") }}
          <v-spacer />

          <v-btn
            v-if="mdAndUp"
            icon="mdi-download"
            variant="flat"
            :loading="enTéléchargement"
            @click="() => téléchargerDonnées()"
          />
          <v-switch
            v-if="false"
            v-model="précipSurCarte"
            true-icon="mdi-weather-pouring"
            false-icon="mdi-cloud-off-outline"
            :color="précipSurCarte ? 'primary' : undefined"
          />
            <v-menu>
              <template #activator="{props: propsActivateur}">
                <v-btn v-bind="propsActivateur" icon="mdi-cog" variant="flat"></v-btn>
              </template>
              <v-list>
                <v-list-item v-if="!mdAndUp" prepend-icon="mdi-download" :title="t('démo.indiceTélécharger')" @click="() => téléchargerDonnées()" />
                <v-list-item class="text-error" :title="t('démo.effacerDonnées')" @click="()=>effacerDonnées()">
                  <template #prepend>
                    <v-icon icon="mdi-delete" />
                  </template>
                </v-list-item>
              </v-list>
            </v-menu>
        </div>
        <v-card-text class="px-0">
          <v-row v-if="stationSélectionnée">
            <v-col :cols="9">
              <v-img :src="observation?.image" />
            </v-col>
            <v-col :cols="3">
              <EntreeDonnee
                :station="stationSélectionnée"
                :observation="observation"
                :en-soumission="enSoumission"
                @soumettre="(x) => soumettreDonnée(x.précip)"
                @prendre-photo="() => prendrePhoto()"
              />
            </v-col>
          </v-row>
          <div v-else class="mx-auto my-auto text-h5 text-center text-disabled">
            {{ t(plusDePhotos ? "démo.plusDePhotos" : "démo.choisirStation") }}
            <br />
            <v-btn
              icon="mdi-camera-outline"
              variant="flat"
              @click="() => prendrePhoto()"
            />
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-dialog v-else v-model="dialogueVisible">
      <EntreeDonnee 
        :station="stationSélectionnée!"
        :observation="observation"
        :en-soumission="enSoumission"
        @soumettre="(x) => soumettreDonnée(x.précip)"
        @prendre-photo="() => prendrePhoto()"
      />
    </v-dialog>
    <v-col :cols="mdAndUp ? 6 : 12">
      <div
        class="mx-auto"
        :style="{
          height: mdAndUp ? '65vh' : '60vh',
          width: mdAndUp ? '50vw' : '100vw',
        }"
      >
        <l-map
          ref="map"
          :zoom="10"
          :center="[27.6461574, 85.3402103]"
          :useGlobalLeaflet="false"
        >
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          >
          </l-tile-layer>
          <marqueur-station
            v-for="station in stations"
            :key="station.id"
            :coords="station.coords"
            :id-station="station.id"
            @prendre-photo="() => prendrePhoto({ idStation: station.id })"
          />
        </l-map>
      </div>
    </v-col>
    <v-col :cols="12" class="my-0 py-0">
      <div
        class="px-6 text-disabled"
        @click="() => ouvrirLien('https://data.smartphones4water.org/')"
      >
        {{ t("démo.source") }}
        <v-icon class="mx-2" size="small" icon="mdi-open-in-new" />
        {{ t("démo.merci") }}
        <v-icon class="mx-2" icon="mdi-emoticon-happy-outline" size="small" />
      </div>
    </v-col>
  </etape-cours>
</template>
<script setup lang="ts">
import {
  கிளிமூக்கை_பயன்படுத்து,
} from "@lassi-js/kilimukku-vue";
import { useDisplay } from "vuetify";

import EtapeCours from "@/components/ÉtapeCours.vue";

import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
import MarqueurStation from "./MarqueurStation.vue";
import EntreeDonnee from "./EntréeDonnée.vue";
import { InfoObservation, stations } from "@/données/népal";
import { ouvrirLien } from "@/utils/utils";
import { computed, ref } from "vue";
import { utiliserDonnées } from "@/composables/données";
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
const { $மொ: t } = மொழியாக்கம்_பயன்படுத்து();

const { 
  choisirObservationAléatoire, exporterDonnées, contribuer, effacerDonnées 
} = utiliserDonnées();

// Contrôles
const précipSurCarte = ref(false);
const stationSélectionnée = computed(() => {
  return stations.find((s) => s.id === observation.value?.station);
});

const enTéléchargement = ref(false);
const téléchargerDonnées = async () => {
  enTéléchargement.value = true;
  await exporterDonnées();
  enTéléchargement.value = false;
};

const dialogueVisible = ref(false);

// Sélection photos
const observation = ref<InfoObservation>();
watchEffect(()=>{
  dialogueVisible.value = !!observation.value
})
const plusDePhotos = ref(false);
let dernièreStationDemandée: string | undefined = undefined;

const prendrePhoto = async ({ idStation }: { idStation?: string } = {}) => {
  dernièreStationDemandée = idStation;
  const nouvellePhoto = choisirObservationAléatoire({
    idStation,
    idPrésente: observation.value?.id,
  });
  observation.value = nouvellePhoto;
  if (!nouvellePhoto) plusDePhotos.value = true;
};

const enSoumission = ref(false);
const soumettreDonnée = async (précip: number) => {
  if (!observation.value) throw new Error("Observation non sélectionnée");
  enSoumission.value = true;
  await contribuer({
    précip,
    obs: observation.value,
  });
  if (mdAndUp.value) {
    prendrePhoto({ idStation: dernièreStationDemandée });
  } else {
    observation.value = undefined
  }
  enSoumission.value = false;
};
</script>
