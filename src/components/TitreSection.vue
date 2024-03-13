<template>
  <v-col cols="12">
    <h1 class="text-h3 font-weight-bold text-center mb-4">{{ titre }}</h1>
    <div class="text-h5 font-weight-light text-center">
      <span v-for="st in listeSousTitres">
        {{ st }}
        <br />
      </span>
    </div>
  </v-col>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ titre: string; sousTitre?: string | string[] }>();
const listeSousTitres = computed(() => {
  if (!props.sousTitre) return [];
  if (typeof props.sousTitre === 'string') return [props.sousTitre];
  return props.sousTitre;
});
</script>
