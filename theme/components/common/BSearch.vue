<script setup lang="ts">
import { ref } from "vue";
import BSearchButton from "./BSearchButton.vue";

const show = ref(false);
</script>

<template>
  <BSearchButton v-model="show" />
  <BSearchBox v-model="show" />
</template>
