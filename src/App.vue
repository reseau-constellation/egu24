<template>
  <v-app>
    <v-locale-provider :rtl="dàg">
      <v-main>
        <BtnMenuLangues />
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-main>
    </v-locale-provider>
  </v-app>
</template>

<script setup lang="ts">
import { மொழிகளைப்_பயன்படுத்து } from "@lassi-js/kilimukku-vue";

// Direction texte
const { வலதிலிருந்து_இடது_மொழி } = மொழிகளைப்_பயன்படுத்து();
const dàg = வலதிலிருந்து_இடது_மொழி();
</script>
