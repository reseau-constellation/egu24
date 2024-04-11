<template>
    <v-card variant="flat" class="pa-2">
        <v-card-item class="px-0 pt-0">
          <v-card-title>
            {{ station.id }}
          </v-card-title>
          <v-card-subtitle>
            <v-icon icon="mdi-map-marker-outline" start />{{
              `${latFormatté}, ${longFormatté}`
            }}
            <br />
            <span v-if="observation">
              <v-icon icon="mdi-clock-time-three-outline" start />
              {{ new Date(observation.horo).toLocaleString() }}
            </span>
          </v-card-subtitle>
        </v-card-item>
        <v-card-text>
          <v-img v-if="!mdAndUp" class="pb-6" :src="observation?.image" />
          <v-text-field
            v-model="précip"
            variant="outlined"
            :label="t('démo.indicePrécip')"
            :rules="validPrécip"
            :disabled="enSoumission"
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
          >
            {{ t('démo.soumettre') }}
          </v-btn>
          <v-btn
            class="my-2"
            width="100%"
            append-icon="mdi-camera-flip-outline"
            variant="outlined"
            @click="() => prendrePhoto()"
          >
            {{ t('démo.nouvellePhoto') }}
          </v-btn>
        </v-card-text>
      </v-card>
</template>
<script setup lang="ts">
import {
  எண்களைப்_பயன்படுத்து,
  கிளிமூக்கை_பயன்படுத்து,
} from "@lassi-js/kilimukku-vue";
import type { InfoObservation, InfoStation } from "@/données/népal";

import { computed, ref } from "vue";
import { useDisplay } from "vuetify";

const props = defineProps<{station: InfoStation, observation?: InfoObservation, enSoumission: boolean}>();
const émettre = defineEmits<{
    (e: 'soumettre', args: { précip: number }): void;
    (e: 'prendrePhoto'): void;
}>();

const { mdAndUp } = useDisplay();
const { மொழியாக்கம்_பயன்படுத்து } = கிளிமூக்கை_பயன்படுத்து();
const { $மொ: t, மொ: t_ } = மொழியாக்கம்_பயன்படுத்து();
const { எண்ணை_வடிவூட்டு } = எண்களைப்_பயன்படுத்து();

// Station
const latFormatté = எண்ணை_வடிவூட்டு(
  computed(() =>
    Number.parseFloat(props.station.coords[0].toFixed(4) || "0"),
  ),
);
const longFormatté = எண்ணை_வடிவூட்டு(
  computed(() =>
    Number.parseFloat(props.station.coords[1].toFixed(4) || "0"),
  ),
);

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
    return t('démo.numéroInvalid');
  },
];

// Actions
const soumettreDonnée = () => {
    émettre("soumettre", { précip: parseFloat(précip.value) });
    précip.value = "";
}
const prendrePhoto = () => {
    émettre("prendrePhoto");
}
</script>