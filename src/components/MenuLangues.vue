<template>
  <v-btn
    :style="
      'position: absolute;' + (isRtl ? 'left:' : 'right:') + '20px; top: 20px'
    "
    icon="mdi-earth"
    size="small"
    style="z-index: 100"
  >
    <v-icon size="large"></v-icon>

    <v-menu
      activator="parent"
      offset="10px"
      min-width="225"
      :location="isRtl ? 'bottom right' : 'bottom left'"
    >
      <v-list>
        <v-text-field
          v-model="rechercheLangue"
          density="compact"
          prepend-inner-icon="mdi-magnify"
          autofocus
          hide-details
          @click.stop
        ></v-text-field>
        <v-list class="overflow-y-auto" max-height="400px" min-width="200px">
          <item-langue
            v-for="code in languesDisponibles"
            :key="code"
            :code="code"
            :selectionnee="code === மொழி"
            @click="() => மொழிகளை_தேர்ந்தெடுக்கொள்ளு(code)"
          />
        </v-list>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script setup lang="ts">
import { useRtl } from "vuetify";
import { மொழிகளைப்_பயன்படுத்து } from "@lassi-js/kilimukku-vue";

import ItemLangue from "@/components/ItemLangueProgrès.vue";
import { கிளிமூக்கை_பயன்படுத்து } from "@lassi-js/kilimukku-vue";

import { computed, ref } from "vue";

const constellationPrète = ref(false);

const { கிடைக்கும்_மொழிகளை_பயன்படுத்து } = கிளிமூக்கை_பயன்படுத்து();
const { மொழிகளும்_குறியீடுகளும் } = கிடைக்கும்_மொழிகளை_பயன்படுத்து({});
const { மொழியாக்கம்_பயன்படுத்து } = கிளிமூக்கை_பயன்படுத்து();
const { $மொ: t } = மொழியாக்கம்_பயன்படுத்து({});

const { isRtl } = useRtl();

const { மொழி, மொழிகளை_தேர்ந்தெடுக்கொள்ளு } = மொழிகளைப்_பயன்படுத்து();

// Recherche
const rechercheLangue = ref<string>();
const languesDisponibles = computed(() => {
  return மொழிகளும்_குறியீடுகளும்.value
    .filter(
      (lng) =>
        !rechercheLangue.value ||
        lng.குறியீடு.includes(rechercheLangue.value) ||
        lng.மொழி.includes(rechercheLangue.value),
    )
    .map((lng) => lng.குறியீடு);
});
</script>

<style></style>
