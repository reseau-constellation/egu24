<template>
    <v-dialog v-model="dialogue">
        <template #activator="{props: propsActivateur}">
            <slot name="activator" v-bind="{props: propsActivateur}" />
        </template>
        <v-card class="mx-auto">
            <v-card-item>
                <v-card-title>
                    Connexions
                </v-card-title>
            </v-card-item>
            <v-card-text>
                <v-list>
                    <v-list-item v-for="c in connexionsSfip" :title="c.pair" :subtitle="c.adresses[0]">
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { suivre, constellation } from '@/composables/données';
import { ref } from 'vue';

const dialogue = ref(false);

const constl = constellation();
const connexionsSfip = suivre(constl.réseau.suivreConnexionsPostesSFIP)
</script>