<script setup lang="ts">
import { ref } from "vue";
import BLocalSearchBox from "./BLocalSearchBox.vue";
import BSearchButton from "./BSearchButton.vue";

const show = ref(false);
</script>

<template>
  <BSearchButton v-model="show" @click="show = true" />
  <BLocalSearchBox v-if="show" @close="show = false" />
</template>
