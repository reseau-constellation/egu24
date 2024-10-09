<template>
    <v-dialog v-model="dialogue">
        <template #activator="{props: propsActivateur}">
            <slot name="activator" v-bind="{props: propsActivateur}" />
        </template>
        <v-card class="mx-auto">
            <v-card-item>
                <v-card-title>
                    Infos
                </v-card-title>
            </v-card-item>
            <v-card-text>
                <v-list>
                    <v-list-subheader>Mon Id Constellation</v-list-subheader>
                    <v-list-item>{{ monIdCompte }}</v-list-item>
                    <v-list-subheader>Connexions Constellation</v-list-subheader>
                    <v-list-item v-for="c in membres" :title="c.infoMembre.idCompte" :subtitle="c.vuÀ">
                    </v-list-item>
                    <v-list-subheader>Mon Id SFIP</v-list-subheader>
                    <v-list-item>{{ monIdSfip }}</v-list-item>
                    <v-list-subheader>Connexions SFIP</v-list-subheader>
                    <v-list-item v-for="c in connexionsSfip" :title="c.pair" :subtitle="c.adresses[0]">
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { suivre, constellation } from '@/composables/données';
import { ref, watchEffect } from 'vue';

const dialogue = ref(false);

const constl = constellation();
const connexionsSfip = suivre(constl.réseau.suivreConnexionsPostesSFIP)
const monIdSfip = ref<string>();
watchEffect(async () => {
    monIdSfip.value =  (await constl.obtIdSFIP()).toString()
})

const monIdCompte = suivre(constl.suivreIdCompte);
const membres = suivre(constl.réseau.suivreConnexionsMembres);
</script>