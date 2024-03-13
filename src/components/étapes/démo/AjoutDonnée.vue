<template>
    <v-img :scr="image"></v-img>
    <v-text-field v-model="val" :rules="règles" variant="outlined" />
    <v-btn append-icon="mdi-check" @click="()=>valNumérique && émettre('valider', valNumérique)">Save</v-btn>
</template>
<script setup lang="ts">
import { எண்ணிக்கையை_கண்டுப்பிடி } from '@lassi-js/kilimukku-vue';
import { computed, ref } from 'vue';

defineProps<{image: string}>();
const émettre = defineEmits<{
    (é: 'valider', x: number): void;
}>();

const { எண்ணுக்கு } = எண்ணிக்கையை_கண்டுப்பிடி()
const val = ref<string>();
const règles = [
    (x: string) => {
        try {
            const n = எண்ணுக்கு({உரை: x})
            return n >= 0 ? true : "Precipitation must be a non-negative number."
        } catch {
            return "Precipitation must be a number."
        }
    }
]
const valNumérique = computed(() => {
    if (!val.value) return undefined;
    try {
        const n = எண்ணுக்கு({உரை: val.value})
        return n
    } catch {
        return undefined;
    }
})
</script>