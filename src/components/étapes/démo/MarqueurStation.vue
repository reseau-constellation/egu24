<template>
  <l-marker :lat-lng="coords">
    
  </l-marker>
</template>
<script setup lang="ts">
import { LMarker } from "@vue-leaflet/vue-leaflet";

defineProps<{
  coords: [number, number]
}>();
</script>