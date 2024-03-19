<template>
    <v-card class="ma-2 pa-2" variant="outlined" :color="emphase ? 'primary' : 'secondary'" @click="() => ouvrirLien(lien)">
        <v-card-item>
            <v-card-title>{{ titre }}</v-card-title>
        </v-card-item>
        <v-card-text class="text-center">
            <v-icon :icon="icône" size="50" />
        </v-card-text>
    </v-card>
</template>
<script setup lang="ts">
import { ouvrirLien } from '@/utils/utils';

defineProps<{lien: string, titre: string, icône: string, emphase?: boolean}>();
</script>