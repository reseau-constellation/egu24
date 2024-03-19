<template>
  <etape-cours
    :n-etapes="nEtapes"
    :etape="etape"
    @retour="() => émettre('retour')"
    @avancer="() => émettre('avancer')"
  >
    <v-col :cols="mdAndUp ? 4 : 12" class="pa-6">
      <span class="text-h3">Live demo !</span>
      <div>{{ t("You are now a citizen scientist") }}</div>
      <div>https://data.smartphones4water.org/</div>
      <v-btn append-icon="mdi-camera">Choose random photo</v-btn>
      <v-switch :label="t('Show rainfall')" />
    </v-col>
    <v-col :cols="mdAndUp ? 8 : 12" class="pa-6">
      <div
        class="mx-auto"
        :style="{
          height: mdAndUp ? '75vh' : '60vh',
          width: mdAndUp ? '50vw' : '100vw',
        }"
      >
        <l-map
          ref="map"
          :zoom="10"
          :center="[27.8, 86]"
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
import { stations } from "@/données/népal";

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
