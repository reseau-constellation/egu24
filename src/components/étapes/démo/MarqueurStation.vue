<template>
  <l-marker :lat-lng="coords">
    <l-popup>
      <v-card variant="flat" width="250">
        <v-card-item class="px-0">
          <v-card-title>{{ nomStation }}</v-card-title>
          <v-card-subtitle>
            {{ `${latFormatté}, ${longFormatté}` }}
          </v-card-subtitle>
        </v-card-item>
        <v-card-text class="px-0 text-center">
          <GraphiqueStation :hauteur="150" :vals="numérisées"/>
          <v-btn variant="flat" icon="mdi-camera-outline" size="small" @click="()=>émettre('prendrePhoto')"/>
        </v-card-text>
      </v-card>
    </l-popup>
  </l-marker>
</template>
<script setup lang="ts">
import { எண்களைப்_பயன்படுத்து } from "@lassi-js/kilimukku-vue";
import { LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import { computed } from "vue";
import GraphiqueStation from "./GraphiqueStation.vue";
import { utiliserDonnées } from "@/composables/données";

const props = defineProps<{
  coords: [number, number];
  nomStation: string;
  idStation: string;
}>();
const émettre = defineEmits<{
  (e: 'prendrePhoto'): void
}>();

const { எண்ணை_வடிவூட்டு } = எண்களைப்_பயன்படுத்து();
const { utiliserDonnéesStation } = utiliserDonnées();

const latFormatté = எண்ணை_வடிவூட்டு(
  computed(() => Number.parseFloat(props.coords[0].toFixed(4))),
);
const longFormatté = எண்ணை_வடிவூட்டு(
  computed(() => Number.parseFloat(props.coords[1].toFixed(4))),
);

const numérisées = utiliserDonnéesStation({ idStation: props.idStation })

</script>
<style>
.leaflet-popup-content {
  width: 250px;
}
</style>
