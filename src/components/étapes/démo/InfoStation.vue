<template>
  <v-line-chart></v-line-chart>
  <v-dialog>
    <template #activator="{ props: propsActivateur }">
      <v-btn
        v-bind="propsActivateur"
        :disabled="!prochainePhoto"
        append-icon="mdi-plus"
        >Contribute data</v-btn
      >
    </template>
    <v-card>
      {{ prochainePhoto }}
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { utiliserDonnées } from "@/composables/données";

const props = defineProps<{ idStation: string }>();

const { aléatoire } = utiliserDonnées();

const prochainePhoto = aléatoire({ idStation: props.idStation });
</script>
