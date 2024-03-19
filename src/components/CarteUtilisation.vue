<template>
  <v-card width="300" height="330" class="text-center">
    <v-card-item class="mt-4">
      <v-card-title class="text-h5 font-weight-bold">{{ titre }}</v-card-title>
    </v-card-item>
    <v-card-text>
      <v-img class="my-6" height="100" src="@/assets/logo.svg" />
      {{ sousTitre }}
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
defineProps<{
  titre: string;
  sousTitre: string;
  image: string;
  lien: string;
}>();
</script>
