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

    <menu-langues />
  </v-btn>
</template>

<script setup lang="ts">
import { useRtl } from "vuetify";

import MenuLangues from "./MenuLangues.vue";

const { isRtl } = useRtl();
</script>

<style></style>
