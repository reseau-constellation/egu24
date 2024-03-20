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
      </v-card>
      <v-divider class="my-4" />
    </v-col>
    <v-col :cols="mdAndUp ? 5 : 12">
      <v-card class="px-6" variant="flat" height="65vh">
        <div class="text-h5 d-flex">
          {{ t("démo.sousTitre") }}
          <v-spacer />
          <v-btn icon="mdi-camera-outline" variant="flat" />
          <v-btn icon="mdi-download" variant="flat" />
          <v-switch
            v-model="précipSurCarte"
            true-icon="mdi-weather-pouring"
            false-icon="mdi-cloud-off-outline"
            :color="précipSurCarte ? 'primary' : undefined"
          />
        </div>
        <v-card-text class="px-0" >
          <v-row v-if="stationSélectionnée">
            <v-col :cols="9">
              <v-img
                src="@/données/images/0eaefd63-e4da-43c0-8b15-3c8400f84021.jpg"
              />
            </v-col>
            <v-col :cols="3">
              <v-card variant="flat">
                <v-card-item class="px-0 pt-0">
                  <v-card-title>
                    {{ stationSélectionnée.nom }}
                  </v-card-title>
                  <v-card-subtitle> 120.45, 89.5 </v-card-subtitle>
                </v-card-item>
                <v-card-text class="px-0">
                  <v-text-field
                    v-model="précip"
                    variant="outlined"
                    label="Input rainfall (mm)"
                    :rules="validPrécip"
                    clearable
                  ></v-text-field>
                  <v-btn
                    class="my-2"
                    width="100%"
                    append-icon="mdi-check"
                    variant="outlined"
                    :disabled="!précip"
                    :loading="enSoumission"
                    @click="() => soumettreDonnée()"
                    >Submit</v-btn
                  >
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions
          class="text-disabled"
          @click="() => ouvrirLien('https://data.smartphones4water.org/')"
        >
          {{ t("démo.source") }}
          <v-icon class="mx-2" size="small" icon="mdi-open-in-new" />
          {{ t("démo.merci") }}
          <v-icon class="mx-2" icon="mdi-emoticon-happy-outline" size="small" />
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col :cols="mdAndUp ? 7 : 12">
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
            :titre="station.nom"
            @click="() => sélectionnerStation(station)"
          />
        </l-map>
      </div>
    </v-col>
  </etape-cours>
</template>
<script setup lang="ts">
import { கிளிமூக்கை_பயன்படுத்து } from "@lassi-js/kilimukku-vue";
import { useDisplay } from "vuetify";

import EtapeCours from "@/components/ÉtapeCours.vue";

import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
import MarqueurStation from "./MarqueurStation.vue";
import { InfoStation, stations } from "@/données/népal";
import { ouvrirLien } from "@/utils/utils";
import { computed, ref } from "vue";

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

// Contrôles
const précipSurCarte = ref(false);
const stationSélectionnée = ref<InfoStation>();
const sélectionnerStation = (station: InfoStation) => {
  if (stationSélectionnée.value?.id !== station.id) {
    stationSélectionnée.value = station;
  } else {
    stationSélectionnée.value = undefined;
  }
};

// Entrée données
const précip = ref("");
const précipValid = computed(() => {
  try {
    const v = parseFloat(précip.value);
    if (!isNaN(v)) return true;
  } catch {
    return false;
  }
});
const validPrécip = [
  (val: string) => {
    if (val === "") return true;
    if (précipValid.value) return true;
    return "Invalid number";
  },
];

const enSoumission = ref(false);
const soumettreDonnée = async () => {
  enSoumission.value = true;
  await new Promise((résoudre) => setTimeout(résoudre, 2000));
  précip.value = "";
  enSoumission.value = false;
};
</script>
