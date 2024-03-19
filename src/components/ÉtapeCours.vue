<template>
  <v-window-item :key="etape" style="height: 100%">
    <v-row style="height: 100%">
      <!--; background-color: #fcf2e1-->
      <v-col v-if="etape > 0" :cols="12" class="mt-6 text-center">
        <v-btn @click="() => émettre('retour')" icon="mdi-chevron-up" />
      </v-col>
      <slot></slot>
      <v-col v-if="etape < nEtapes - 1" :cols="12" class="mt-auto text-center">
        <v-btn
          @click="() => émettre('avancer')"
          class="pa-2"
          icon="mdi-chevron-down"
        />
      </v-col>
    </v-row>
  </v-window-item>
</template>
<script setup lang="ts">
defineProps<{
  nEtapes: number;
  etape: number;
}>();
const émettre = defineEmits<{
  (e: "retour"): void;
  (e: "avancer"): void;
}>();
</script>
