<template>
  <v-data-table :items="mesContributions">
    <template #item.modif="{ item }">
      <v-btn icon="mdi-delete" color="error" @click="() => effacer(item.id)" />
    </template>
  </v-data-table>
</template>
<script setup lang="ts">
import { utiliserDonnées } from "@/composables/données";

const { mesContributions, effacer } = utiliserDonnées();
</script>
